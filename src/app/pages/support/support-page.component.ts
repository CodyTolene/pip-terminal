// support-page.component.ts
import { GithubService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

const REPO = {
  base: `https://raw.githubusercontent.com/`,
  branch: 'main',
  name: 'The-Wand-Company-Pip-Boy-3000-Mk-V-Community-Guide',
  readme: 'README.md',
  user: 'beaverboy-12',
};

@Component({
  selector: 'pip-support-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'support-page.component.html',
  styleUrl: 'support-page.component.scss',
})
export class SupportPageComponent implements OnInit {
  private readonly svc = inject(GithubService);

  private readonly src = `${REPO.base}${REPO.user}/${REPO.name}/refs/heads/${REPO.branch}/${REPO.readme}`;

  @ViewChild('viewport', { static: false })
  private viewportRef?: ElementRef<HTMLElement>;

  protected readonly html = signal<SafeHtml | null>(null);
  protected readonly error = signal<boolean>(false);
  protected readonly loading = signal<boolean>(false);

  private history: string[] = [];
  private idx = -1;

  protected readonly currentUrl = signal<string>('');

  public ngOnInit(): void {
    this.navigate(this.src, true);
  }

  @HostListener('click', ['$event'])
  public onHostClick(ev: MouseEvent): void {
    const vp = this.viewportRef?.nativeElement;
    if (!vp || !vp.contains(ev.target as Node)) return;

    const a = (ev.target as HTMLElement).closest(
      'a',
    ) as HTMLAnchorElement | null;
    if (!a) return;

    const next = a.getAttribute('data-doc-href');
    if (next) {
      ev.preventDefault();
      const hash = a.getAttribute('data-doc-hash') ?? '';
      const url = hash ? `${next}#${hash}` : next;
      this.navigate(url);
      return;
    }

    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) {
      ev.preventDefault();
      this.scrollToAnchor(href.slice(1));
    }
  }

  protected goBack(): void {
    if (!this.canGoBack()) return;
    this.idx -= 1;
    this.load(this.history[this.idx]);
  }
  protected goForward(): void {
    if (!this.canGoForward()) return;
    this.idx += 1;
    this.load(this.history[this.idx]);
  }
  protected reload(): void {
    if (this.idx < 0) return;
    this.load(this.history[this.idx], true);
  }
  protected canGoBack(): boolean {
    return this.idx > 0;
  }
  protected canGoForward(): boolean {
    return this.idx >= 0 && this.idx < this.history.length - 1;
  }

  private extractHash(url: string): string | '' {
    const i = url.indexOf('#');
    return i >= 0 ? url.substring(i + 1) : '';
  }

  private async load(url: string, forceScrollTop = false): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    this.currentUrl.set(url);
    try {
      const html = await this.svc.getReadme(url);
      if (!html) throw new Error('null');
      this.html.set(html);
      this.loading.set(false);

      if (forceScrollTop) this.scrollToTop();

      const anchor = this.extractHash(url);
      if (anchor) queueMicrotask(() => this.scrollToAnchor(anchor));
    } catch {
      this.loading.set(false);
      this.error.set(true);
    }
  }

  private navigate(url: string, replace = false): void {
    if (!replace) {
      if (this.idx < this.history.length - 1)
        this.history = this.history.slice(0, this.idx + 1);
      this.history.push(url);
      this.idx = this.history.length - 1;
    } else {
      if (this.idx < 0) {
        this.history = [url];
        this.idx = 0;
      } else {
        this.history[this.idx] = url;
      }
    }
    this.load(url);
  }

  private scrollToTop(): void {
    const vp = this.viewportRef?.nativeElement;
    if (vp) vp.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  private scrollToAnchor(id: string): void {
    const vp = this.viewportRef?.nativeElement;
    if (!vp) return;
    const target = vp.querySelector<HTMLElement>(
      '#' + CSS.escape(id) + ', [name="' + CSS.escape(id) + '"]',
    );
    if (target) {
      const top =
        target.getBoundingClientRect().top -
        vp.getBoundingClientRect().top +
        vp.scrollTop;
      vp.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
