import { environment } from 'src/environments/environment';

import { Injectable, inject, signal } from '@angular/core';

import { ScriptsService } from './scripts.service';

@Injectable({ providedIn: 'root' })
export class AdsService {
  public constructor() {
    const showAds = environment.isProduction;
    this.showAds.set(showAds);

    if (showAds) {
      void this.loadAdsScripts();
    } else {
      this.unloadAdsScripts();
    }
  }

  private readonly adScriptPaths = [
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4966893083726404',
    'https://fundingchoicesmessages.google.com/i/pub-4966893083726404?ers=1',
    'scripts/google-abr.js',
  ] as const;

  private readonly scripts = inject(ScriptsService);
  public readonly showAds = signal<boolean>(false);

  public init(): void {
    // No-op
  }

  private async loadAdsScripts(): Promise<void> {
    const results = await Promise.allSettled(
      this.adScriptPaths.map((path) => this.scripts.loadScript(path)),
    );

    const failedResult = results.find((result) => result.status === 'rejected');
    if (failedResult) {
      this.showAds.set(false);
      this.unloadAdsScripts();
      console.warn(
        'Ads disabled because an ad script failed to load.',
        failedResult.reason,
      );
    }
  }

  private unloadAdsScripts(): void {
    for (const path of this.adScriptPaths) {
      this.scripts.unloadScript(path);
    }
  }
}
