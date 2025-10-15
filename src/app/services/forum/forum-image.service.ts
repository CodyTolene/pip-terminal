import Quill, { Delta } from 'quill';
import Toolbar from 'quill/modules/toolbar';
import { AuthService, ToastService } from 'src/app/services';
import { getFirstNonEmptyValueFrom } from 'src/app/utilities';

import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  Storage,
  getDownloadURL,
  ref as stRef,
  uploadBytes,
} from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class ForumImageService {
  private readonly auth = inject(AuthService);
  private readonly storage = inject(Storage);
  private readonly toast = inject(ToastService);
  private readonly env = inject(EnvironmentInjector);

  private readonly ACCEPT_RE = /^image\//i;
  private readonly BASE_PATH = 'forum/uploads';
  private readonly MAX_BYTES = 2 * 1024 * 1024; // 2MB

  private inCtx<T>(fn: () => Promise<T>): Promise<T> {
    return runInInjectionContext(this.env, fn);
  }

  public attachToQuill(q: Quill): () => void {
    // Toolbar image"handler
    const tb: Toolbar | undefined = q.getModule('toolbar') as
      | Toolbar
      | undefined;
    const pickHandler = (): Promise<void> => this.pickAndInsertImage(q);
    if (tb) tb.addHandler('image', pickHandler);

    // Paste/drop listeners (avoid base64, upload to Storage instead)
    const onPaste = (evt: ClipboardEvent): void => {
      const files = evt.clipboardData?.files;
      if (files && files.length) {
        evt.preventDefault();
        this.uploadAndInsertFiles(files, q).catch(this.onError.bind(this));
      }
    };

    const onDrop = (evt: DragEvent): void => {
      const files = evt.dataTransfer?.files;
      if (files && files.length) {
        evt.preventDefault();
        this.uploadAndInsertFiles(files, q).catch(this.onError.bind(this));
      }
    };

    const root: HTMLElement = q.root;
    root.addEventListener('paste', onPaste);
    root.addEventListener('drop', onDrop);

    // Drop any base64 IMG that sneaks in via pasted HTML
    q.clipboard.addMatcher('IMG', (node: Node, delta: Delta) => {
      const src = (node as Element).getAttribute('src') ?? '';
      if (src.startsWith('data:')) return new Delta(); // strip base64 images
      return delta;
    });

    // Teardown
    return () => {
      root.removeEventListener('paste', onPaste);
      root.removeEventListener('drop', onDrop);
    };
  }

  /** Use a file input to pick an image, upload it, and insert into Quill. */
  private async pickAndInsertImage(q: Quill): Promise<void> {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await this.uploadImage(file);
        this.insertImage(q, url);
      } catch (err) {
        this.onError(err);
      }
    };
    input.click();
  }

  /** Handle paste/drop multiple files. */
  private async uploadAndInsertFiles(
    fileList: FileList,
    q: Quill,
  ): Promise<void> {
    for (const file of Array.from(fileList)) {
      if (!this.validate(file)) continue;
      const url = await this.uploadImage(file);
      this.insertImage(q, url);
    }
  }

  /** Upload a single image to Storage and return its download URL. */
  private async uploadImage(file: File): Promise<string> {
    this.ensureValid(file);
    return this.inCtx(async () => {
      // Get current user inside injection context
      const user = await getFirstNonEmptyValueFrom(this.auth.userChanges);
      const uid = user.uid;

      // Build path + ref
      const ext = this.extFrom(file) || 'png';
      const fileName = `post-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;
      const filePath = `${this.BASE_PATH}/${uid}/${fileName}`;
      const storageRef = stRef(this.storage, filePath);

      // Upload + get URL (both inside context)
      await uploadBytes(storageRef, file, {
        contentType: file.type || 'image/jpeg',
        cacheControl: 'public, max-age=31536000, immutable',
      });
      return await getDownloadURL(storageRef);
    });
  }

  /** Insert image embed at the current cursor position. */
  private insertImage(q: Quill, url: string): void {
    const range = q.getSelection(true) ?? { index: q.getLength(), length: 0 };
    q.insertEmbed(range.index, 'image', url, 'user');
    q.setSelection(range.index + 1, 0, 'user');
  }

  private validate(file: File): boolean {
    if (!this.ACCEPT_RE.test(file.type)) {
      this.toast.error({
        message: 'Only images are allowed.',
        durationSecs: 3,
      });
      return false;
    }
    if (file.size > this.MAX_BYTES) {
      this.toast.error({
        message: 'Image too large (max 2MB).',
        durationSecs: 3,
      });
      return false;
    }
    return true;
  }

  private ensureValid(file: File): void {
    if (!this.validate(file)) throw new Error('Invalid image');
  }

  private extFrom(file: File): string | null {
    // Prefer MIME → extension
    const mime = (file.type || '').toLowerCase();
    if (mime.startsWith('image/')) {
      const tail = mime.split('/')[1];
      return tail?.includes('+') ? tail.split('+')[0] : tail || null;
    }
    // Fallback to filename
    const m = file.name.match(/\.([a-z0-9]+)$/i);
    return m ? m[1] : null;
  }

  private onError(err: unknown): void {
    console.error('[ForumImageService] upload failed', err);
    // this.toast.error({ message: 'Image upload failed.', durationSecs: 3 });
  }
}
