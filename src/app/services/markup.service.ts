import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  SecurityContext,
  inject,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class MarkupService {
  private readonly doc = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Sanitize untrusted HTML for storage in Firestore.
   *
   * @param untrusted An HTML string from user input.
   * @returns A sanitized HTML string safe for Firestore.
   */
  public sanitizeForStorage(
    untrusted: string | null | SafeHtml | undefined,
  ): string {
    const clean =
      this.sanitizer.sanitize(SecurityContext.HTML, untrusted ?? '') ?? '';

    // Harden anchors (open in new tab, avoid SEO abuse)
    const withAnchors = clean.replace(
      /<a\b([^>]*href=['"][^'"]+['"][^>]*)>/gi,
      '<a $1 rel="nofollow noopener noreferrer" target="_blank">',
    );

    // Disallow data images entirely (we store real URLs from Storage)
    const noDataImages = withAnchors.replace(
      /(<img\b[^>]*\s)src=['"]data:[^'"]+['"]/gi,
      '$1src=""',
    );

    return noDataImages;
  }

  /**
   * Return SafeHtml for [innerHTML].
   * Only call this on untrusted input after sanitizeToString
   */
  public toSafeHtml(untrustedHtml: string | null | undefined): SafeHtml {
    const clean =
      this.sanitizer.sanitize(SecurityContext.HTML, untrustedHtml ?? '') ?? '';
    const hardened = clean.replace(
      /<a\b([^>]*href=['"][^'"]+['"][^>]*)>/gi,
      '<a $1 rel="nofollow noopener noreferrer" target="_blank">',
    );
    return this.sanitizer.bypassSecurityTrustHtml(hardened);
  }

  /** Extract text from HTML safely (works in browser and SSR) */
  public getTextFrom(html: string | null | SafeHtml | undefined): string {
    const safe = this.sanitizeToString(html);
    if (!isPlatformBrowser(this.platformId)) {
      // Simple SSR fallback: strip tags and decode a few common entities
      return safe
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
    }
    const tpl = this.doc.createElement('template'); // inert
    tpl.innerHTML = safe;
    return tpl.content.textContent?.trim() ?? '';
  }

  /** Sanitize untrusted HTML to a plain string */
  private sanitizeToString(html: string | null | SafeHtml | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html ?? '') ?? '';
  }
}
