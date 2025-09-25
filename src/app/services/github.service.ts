import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { Injectable, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface GithubUrlData {
  rawUrl: string;
  rawDir: URL;
  blobBase: URL;
}

@Injectable({ providedIn: 'root' })
export class GithubService {
  private sanitizer = inject(DomSanitizer);

  /**
   * Accepts GitHub URLs only:
   *  - https://github.com/OWNER/REPO/blob/BRANCH/path/file.md
   *  - https://github.com/OWNER/REPO/tree/BRANCH/path/  (auto README.md)
   *  - https://raw.githubusercontent.com/OWNER/REPO/BRANCH/path/file.md
   * Returns SafeHtml or null.
   */
  public async getReadme(inputUrl: string): Promise<SafeHtml | null> {
    let normalized: GithubUrlData | null = null;

    try {
      normalized = this.normalizeGithubUrl(inputUrl);
    } catch {
      return null; // reject non-GitHub or invalid URLs
    }

    try {
      const res = await fetch(normalized.rawUrl, { cache: 'no-cache' });
      if (!res.ok) return null;

      const md = await res.text();
      const html = marked.parse(md);

      // Rewrite links/images before sanitizing
      const rewritten = this.rewriteLinksAndImages(
        html as string,
        normalized.rawDir,
        normalized.blobBase,
      );

      // Sanitize, but keep our navigation markers
      const safe = DOMPurify.sanitize(rewritten, {
        ADD_ATTR: ['data-doc-href', 'data-doc-hash', 'target', 'rel'],
        SANITIZE_NAMED_PROPS: true,
        // Extra hardening. Scripts/handlers are removed by default;
        // the following forbids a few risky containers (rare in READMEs).
        FORBID_TAGS: [
          'style',
          'iframe',
          'frame',
          'frameset',
          'object',
          'embed',
          'form',
        ],
      });

      return this.sanitizer.bypassSecurityTrustHtml(safe);
    } catch {
      return null;
    }
  }

  /** Rejects anything not on github.com or raw.githubusercontent.com */
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

    // github.com blob or tree
    if (url.hostname === 'github.com') {
      const parts = url.pathname.split('/').filter(Boolean); // owner repo type branch ...
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
   * Rewrites:
   * - relative images -> absolute RAW URLs
   * - relative .md/folders -> in-frame (data-doc-*) to RAW
   * - absolute same-repo blob/tree .md -> in-frame (data-doc-*) to RAW
   * - any other absolute link -> open in new tab (target=_blank rel=noopener)
   * - other relative non-.md -> GitHub blob in new tab
   */
  private rewriteLinksAndImages(
    html: string,
    rawDir: URL,
    blobBase: URL,
  ): string {
    const wrap = document.createElement('div');
    wrap.innerHTML = html;

    // Same-repo detector for absolute blob/tree links
    const blobParts = blobBase.pathname.split('/').filter(Boolean); // owner, repo, 'blob', branch, ...
    const owner = blobParts[0];
    const repo = blobParts[1];
    const sameRepoAbs = new RegExp(
      `^/(${owner})/(${repo})/(blob|tree)/([^/]+)/(.+)$`,
      'i',
    );

    // Images -> absolute RAW
    wrap.querySelectorAll<HTMLImageElement>('img[src]').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (!src || /^[a-z]+:/i.test(src) || src.startsWith('//')) return;
      img.setAttribute('src', new URL(src, rawDir).toString());
    });

    // Links
    wrap.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href) return;

      // hashes and mailto stay as-is
      if (href.startsWith('#') || href.startsWith('mailto:')) return;

      // Absolute links
      if (/^[a-z]+:/i.test(href) || href.startsWith('//')) {
        try {
          const u = new URL(href, blobBase);

          // Same-repo absolute blob/tree -> in-frame
          const m =
            u.hostname === 'github.com' ? u.pathname.match(sameRepoAbs) : null;
          if (m) {
            const type = m[3]; // 'blob' or 'tree'
            const branch = m[4]; // may contain slashes
            const fileOrDir = m[5]; // path within repo
            const hash = u.hash ? u.hash.slice(1) : '';

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
          /* ignore and treat as external */
        }

        // External absolute link -> always new tab
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        return;
      }

      // Relative links inside repo
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

      // Non-markdown relative -> GitHub blob in a new tab
      const blob = new URL(bare, blobBase).toString();
      a.setAttribute('href', blob);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
    });

    return wrap.innerHTML;
  }
}
