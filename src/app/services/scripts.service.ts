import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScriptsService {
  private loadedScripts = new Map<string, HTMLScriptElement>();

  public loadScript(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(path)) {
        // Already loaded
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = path;
      script.async = false;
      script.defer = false;

      script.onload = () => {
        this.loadedScripts.set(path, script);
        resolve();
      };

      script.onerror = () => {
        reject(new Error(`Failed to load script: ${path}`));
      };

      document.body.appendChild(script);
    });
  }

  public unloadScript(path: string): void {
    const script = this.loadedScripts.get(path);
    if (script) {
      document.body.removeChild(script);
      this.loadedScripts.delete(path);
    }
  }

  public unloadAll(): void {
    for (const [_path, script] of this.loadedScripts) {
      document.body.removeChild(script);
    }
    this.loadedScripts.clear();
  }
}
