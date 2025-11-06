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
   * Count visible characters in HTML, optionally weighting images.
   *
   * @param html The html to count characters from.
   * @param imageWeight The weight to give each image in the count (default 0).
   * @returns The number of characters plus image weights.
   */
  public countVisibleChars(
    html: string | null | SafeHtml | undefined,
    imageWeight = 0,
  ): number {
    const safe =
      this.sanitizer.sanitize(SecurityContext.HTML, html ?? '') ?? '';

    const cleaned = this.sanitizeDangerousTags(safe)
      .replace(/<br\s*\/?>/gi, ' \n ') // normalize breaks
      // add space after block elements to prevent word run-ons
      .replace(
        /<\/(p|div|section|article|header|footer|aside|li|ul|ol|h[1-6]|blockquote|pre|table|thead|tbody|tfoot|tr|td|th)>/gi,
        ' $&',
      );

    const el = this.doc.createElement('div');
    el.innerHTML = cleaned;

    // Count images, then remove them from the DOM text so they are not in the text count
    const imgs = el.querySelectorAll('img').length;
    el.querySelectorAll('img').forEach((node) => node.remove());

    const rawText = (el as HTMLElement).innerText || el.textContent || '';
    const normalized = rawText
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const textChars = Array.from(normalized).length;
    return textChars + imgs * imageWeight;
  }

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
    const safe = this.sanitizeToString(html ?? '');

    const withBreaks = this.sanitizeDangerousTags(safe)
      .replace(/<img\b[^>]*>/gi, ' [img] ') // replace images with marker
      .replace(/<br\s*\/?>/gi, ' \n ') // normalize breaks
      // add space after block elements to prevent word run-ons
      .replace(
        /<\/(p|div|section|article|header|footer|aside|li|ul|ol|h[1-6]|blockquote|pre|table|thead|tbody|tfoot|tr|td|th)>/gi,
        ' $&',
      );

    if (!isPlatformBrowser(this.platformId)) {
      // SSR: strip tags, decode entities, normalize whitespace
      return withBreaks
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Browser: ensure imgs become text nodes, then use innerText for spacing
    const el = this.doc.createElement('div');
    el.innerHTML = withBreaks;

    // Fallback in case any <img> slipped through
    el.querySelectorAll('img').forEach((img) => {
      img.replaceWith(this.doc.createTextNode(' [img] '));
    });

    const text = (el as HTMLElement).innerText || el.textContent || '';
    return text
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Remove potentially dangerous <script> and <style> tags and fragments.
   * Applies replacements repeatedly until no more matches.
   */
  private sanitizeDangerousTags(input: string): string {
    let previous: string;
    do {
      previous = input;
      input = input
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '') // full script tags
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '') // full style tags
        .replace(/<script\b[^>]*>/gi, '') // orphaned opening script tags
        .replace(/<style\b[^>]*>/gi, '') // orphaned opening style tags
        .replace(/<\/script>/gi, '') // orphaned closing script tags
        .replace(/<\/style>/gi, ''); // orphaned closing style tags
    } while (input !== previous);
    return input;
  }

  /** Sanitize untrusted HTML to a plain string */
  private sanitizeToString(html: string | null | SafeHtml | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html ?? '') ?? '';
  }
}
