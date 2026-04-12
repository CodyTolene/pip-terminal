import { environment } from 'src/environments/environment';

import { Injectable, inject, signal } from '@angular/core';

import { ScriptsService } from './scripts.service';

@Injectable({ providedIn: 'root' })
export class AdsService {
  public constructor() {
    const showAds = environment.isProduction;
    this.showAds.set(showAds);

    // Load or unload ad scripts based on whether ads should be shown.
    if (showAds) {
      void this.scripts.loadScript(
        'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4966893083726404',
      );
      void this.scripts.loadScript(
        'https://fundingchoicesmessages.google.com/i/pub-4966893083726404?ers=1',
      );
      void this.scripts.loadScript('scripts/google-abr.js');
    } else {
      this.scripts.unloadAll();
    }
  }

  private readonly scripts = inject(ScriptsService);
  public readonly showAds = signal<boolean>(false);

  public init(): void {
    // No-op
  }
}
