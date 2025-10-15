import {
  FormDirective,
  InputComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { firstValueFrom } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPostCreate } from 'src/app/models';
import {
  AuthService,
  ForumImageService,
  ForumPostsService,
  MarkupService,
  ToastService,
} from 'src/app/services';
import {
  getEnumValues,
  isNonEmptyString,
  isNonEmptyValue,
  shareSingleReplay,
} from 'src/app/utilities';

import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  ForumPostFormGroup,
  forumPostFormGroup,
} from 'src/app/components/forum/post/post-form-group';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-post-form',
  templateUrl: './post-form.component.html',
  imports: [
    InputComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    PipButtonComponent,
    QuillModule,
    ReactiveFormsModule,
  ],
  providers: [],
  styleUrl: './post-form.component.scss',
})
export class PipForumPostFormComponent
  extends FormDirective<ForumPostFormGroup>
  implements OnDestroy
{
  public constructor() {
    super();

    this.formGroup.reset();

    effect(() => {
      const isSubmitting = this.isSubmitting();
      if (isSubmitting) {
        this.formGroup.controls.category.disable({ emitEvent: false });
        this.formGroup.controls.contentHtml.disable({ emitEvent: false });
        this.formGroup.controls.title.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.category.enable({ emitEvent: false });
        this.formGroup.controls.contentHtml.enable({ emitEvent: false });
        this.formGroup.controls.title.enable({ emitEvent: false });
      }
    });
  }

  private readonly authService = inject(AuthService);
  private readonly forumPostsService = inject(ForumPostsService);
  private readonly imageService = inject(ForumImageService);
  private readonly markupService = inject(MarkupService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected override readonly formGroup = forumPostFormGroup;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  private readonly forumLink = '/' + ('forum' satisfies PageUrl);

  protected readonly forumCategoryList = getEnumValues(ForumCategoryEnum);

  protected readonly isSubmitting = signal(false);

  public readonly editorModules = editorModules;
  public readonly allowedFormats = allowedFormats;

  private detachQuill?: () => void;

  protected async createPost(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { category, contentHtml, title } = this.formGroup.value;

      if (!isNonEmptyString(contentHtml)) {
        throw new Error('Content must not be empty!');
      }
      if (!isNonEmptyString(title)) {
        throw new Error('Title must not be empty!');
      }
      if (!isNonEmptyValue(category)) {
        throw new Error('Category must be selected!');
      }

      const user = await firstValueFrom(this.userChanges);
      if (!user) {
        throw new Error('User must be logged in to create a post');
      }

      const safeHtml = this.markupService.sanitizeForStorage(contentHtml ?? '');

      const toCreate: ForumPostCreate = {
        authorId: user.uid,
        authorName: user.displayName || user.email,
        category,
        contentHtml: safeHtml,
        title,
      };

      await this.forumPostsService.addPost(toCreate);

      this.toastService.success({
        message: 'Post created successfully!',
        durationSecs: 3,
      });
      this.formGroup.reset();
      this.isSubmitting.set(false);
      await this.router.navigate([this.forumLink]);
    } catch (e) {
      console.error('Failed to create post:', e);
      this.toastService.error({
        message: 'Failed to create post. Please try again later.',
        durationSecs: 3,
      });
      this.isSubmitting.set(false);
    }
  }

  protected async cancel(): Promise<void> {
    await this.router.navigate([this.forumLink]);
  }

  protected onEditorCreated(q: Quill): void {
    // Delegate all image picking/paste/drop handling to the service
    this.detachQuill?.();
    this.detachQuill = this.imageService.attachToQuill(q);
  }

  public ngOnDestroy(): void {
    this.detachQuill?.();
  }
}

const allowedFormats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'header',
  'list',
  'blockquote',
  'code-block',
  'link',
  'image',
  'align',
];

const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: [1, 2, 3, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
};
