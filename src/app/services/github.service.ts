import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { GithubUrlData } from 'src/app/types/github-url-data';

@Injectable({ providedIn: 'root' })
export class GithubService {
  private sanitizer = inject(DomSanitizer);

  /**
   * Fetch and convert a GitHub README.md to sanitized HTML
   *
   * Accepts a full GitHub URL only
   * - https://github.com/OWNER/REPO/blob/BRANCH/path/to/file.md
   * - https://github.com/OWNER/REPO/tree/BRANCH/path/to/folder/
   * - https://raw.githubusercontent.com/OWNER/REPO/BRANCH/path/to/file.md
   *
   * @returns Sanitized HTML or null on error
   */
  public async getReadme(inputUrl: string): Promise<SafeHtml | null> {
    let normalized: { rawUrl: string; rawDir: URL; blobBase: URL } | null =
      null;

    try {
      normalized = this.normalizeGithubUrl(inputUrl);
    } catch {
      return null; // reject non GitHub or invalid GitHub URLs
    }

    try {
      const res = await fetch(normalized.rawUrl, { cache: 'no-cache' });
      if (!res.ok) return null;

      const md = await res.text();
      // ✅ Marked: remove invalid options (mangle/headerIds) for newer typings
      const html = marked.parse(md);

      const rewritten = this.rewriteLinksAndImages(
        html as string,
        normalized.rawDir,
        normalized.blobBase,
      );
      const safe = DOMPurify.sanitize(rewritten);

      return this.sanitizer.bypassSecurityTrustHtml(safe);
    } catch {
      return null;
    }
  }

  /**
   * Normalize various GitHub URL forms
   *
   * @param input A full GitHub URL
   * @returns GithubUrlData or throws on invalid input
   */
  private normalizeGithubUrl(input: string): GithubUrlData {
    const url = new URL(input);

    // raw form
    if (url.hostname === 'raw.githubusercontent.com') {
      const parts = url.pathname.split('/').filter(Boolean); // owner repo branch path...
      if (parts.length < 4) throw new Error('bad raw path');
      const [owner, repo, branch, ...rest] = parts;
      const path = rest.join('/');
      const rawDir = new URL(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path.replace(/[^/]+$/, '')}`,
      );
      const blobBase = new URL(
        `https://github.com/${owner}/${repo}/blob/${branch}/`,
      );
      return { rawUrl: url.toString(), rawDir, blobBase };
    }

    // blob/tree form
    if (url.hostname === 'github.com') {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length < 5) throw new Error('bad blob/tree path');
      const [owner, repo, type, branch, ...rest] = parts;
      if (type !== 'blob' && type !== 'tree') throw new Error('not blob/tree');

      let path = rest.join('/');
      if (type === 'tree') {
        if (!path.endsWith('/')) path += '/';
        path += 'README.md'; // folder points to its README.md
      }

      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
      const rawDir = new URL(
        `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path.replace(/[^/]+$/, '')}`,
      );
      const blobBase = new URL(
        `https://github.com/${owner}/${repo}/blob/${branch}/`,
      );
      return { rawUrl, rawDir, blobBase };
    }

    throw new Error('not github');
  }

  /**
   * Rewrite links and images in the HTML to point to the correct GitHub URLs.
   *
   * @param html The HTML to rewrite
   * @param rawDir The raw directory URL
   * @param blobBase The blob base URL
   * @returns The rewritten HTML
   */
  private rewriteLinksAndImages(
    html: string,
    rawDir: URL,
    blobBase: URL,
  ): string {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;

    // Regex to detect same-repo absolute links to blob/tree
    // owner, repo, 'blob', branch, ...
    const blobParts = blobBase.pathname.split('/').filter(Boolean);
    const owner = blobParts[0];
    const repo = blobParts[1];
    const sameRepoAbs = new RegExp(
      `^/(${owner})/(${repo})/(blob|tree)/([^/]+)/(.+)$`,
      'i',
    );

    // Images - only relative paths need rewriting
    wrap.querySelectorAll<HTMLImageElement>('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!src || /^[a-z]+:/i.test(src) || src.startsWith('//')) return;
      img.setAttribute('src', new URL(src, rawDir).toString());
    });

    // Links
    wrap.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href) return;

      // Ignore mailto, anchors
      if (href.startsWith('#') || href.startsWith('mailto:')) return;

      // Absolute links
      if (/^[a-z]+:/i.test(href) || href.startsWith('//')) {
        try {
          const u = new URL(href, blobBase);

          // Same-repo absolute link to blob/tree
          const m =
            u.hostname === 'github.com' ? u.pathname.match(sameRepoAbs) : null;
          if (m) {
            const type = m[3]; // 'blob' or 'tree'
            const branch = m[4]; // branch name (may contain slashes)
            const fileOrDir = m[5]; // path within repo
            const hash = u.hash ? u.hash.slice(1) : '';

            // If tree, point to its README.md
            const isDir = type === 'tree';
            const mdPath = isDir
              ? fileOrDir.replace(/\/?$/, '/') + 'README.md'
              : fileOrDir;

            const absRaw = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${mdPath}`;
            a.setAttribute('data-doc-href', absRaw);
            if (hash) a.setAttribute('data-doc-hash', hash);
            a.setAttribute('href', absRaw + (hash ? '#' + hash : ''));
            return;
          }
        } catch {
          // Invalid URL, fall through to external link
        }
        // External link
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        return;
      }

      // Relative links
      const bare = href.split('#')[0];
      const anchor = href.includes('#')
        ? href.substring(href.indexOf('#') + 1)
        : '';
      const isDir = bare.endsWith('/') || !bare.includes('.');
      const isMd = /\.md$/i.test(bare) || isDir;

      if (isMd) {
        const mdPath = isDir ? bare.replace(/\/?$/, '/') + 'README.md' : bare;
        const absRaw = new URL(mdPath, rawDir).toString();

        a.setAttribute('data-doc-href', absRaw);
        if (anchor) a.setAttribute('data-doc-hash', anchor);
        a.setAttribute('href', absRaw + (anchor ? '#' + anchor : ''));
        return;
      }

      // Other relative link (non-md) - point to blob
      const blob = new URL(bare, blobBase).toString();
      a.setAttribute('href', blob);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    return wrap.innerHTML;
  }
}
