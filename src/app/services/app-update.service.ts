import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private readonly swUpdate = inject(SwUpdate);

  public init(): void {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.checkForUpdate();

    // Update in the background
    this.swUpdate.versionUpdates
      .pipe(
        untilDestroyed(this),
        filter((e: VersionEvent) => e.type === 'VERSION_READY'),
      )
      .subscribe(async () => {
        await this.swUpdate.activateUpdate();
      });

    // Handle fatal
    this.swUpdate.unrecoverable.pipe(untilDestroyed(this)).subscribe(() => {
      // If something goes wrong, reload is safest
      location.reload();
    });
  }
}
