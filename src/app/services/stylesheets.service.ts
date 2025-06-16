import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StylesheetsService {
  private loadedStylesheets = new Map<string, HTMLLinkElement>();

  public loadStylesheet(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedStylesheets.has(path)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;

      link.onload = () => {
        this.loadedStylesheets.set(path, link);
        resolve();
      };

      link.onerror = () => {
        reject(new Error(`Failed to load stylesheet: ${path}`));
      };

      // Insert before Angular's main styles
      const angularStyles =
        document.querySelector('link[href*="styles.css"]') ||
        document.querySelector('style[ng-style]');
      if (angularStyles && angularStyles.parentNode) {
        angularStyles.parentNode.insertBefore(link, angularStyles);
      } else {
        document.head.appendChild(link);
      }
    });
  }

  public unloadStylesheet(path: string): void {
    const link = this.loadedStylesheets.get(path);
    if (link) {
      document.head.removeChild(link);
      this.loadedStylesheets.delete(path);
    }
  }

  public unloadAll(): void {
    for (const [_path, link] of this.loadedStylesheets) {
      document.head.removeChild(link);
    }
    this.loadedStylesheets.clear();
  }
}
