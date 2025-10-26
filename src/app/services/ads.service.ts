import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from 'src/environments/environment';

import { Injectable, inject, signal } from '@angular/core';

import { AuthService } from './auth.service';
import { ScriptsService } from './scripts.service';

/**
 * Service responsible for loading and unloading third‑party advertising
 * scripts based on the current user's ad preferences.
 */
@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class AdsService {
  public constructor() {
    this.auth.userChanges.pipe(untilDestroyed(this)).subscribe((user) => {
      const disableAds = !!user?.profile?.disableAds;
      const shouldShow = environment.isProduction && !disableAds;
      this.showAdsSig.set(shouldShow);

      // Load or unload ad scripts based on whether ads should be shown.
      if (shouldShow) {
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
    });
  }

  private readonly scripts = inject(ScriptsService);
  private readonly auth = inject(AuthService);
  private readonly showAdsSig = signal<boolean>(false);

  public init(): void {
    // No-op: Ensures service is constructed.
  }

  public showAds(): boolean {
    return this.showAdsSig();
  }
}
