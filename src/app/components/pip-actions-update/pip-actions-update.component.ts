import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
  timer,
} from 'rxjs';
import { PipFileService } from 'services/pip-file.service';
import { wait } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipButtonComponent } from 'src/app/components/pip-button/pip-button.component';

import { PipDeviceService } from 'src/app/services/pip-device.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logLink, logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-actions-update',
  templateUrl: './pip-actions-update.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    PipButtonComponent,
  ],
  styleUrl: './pip-actions-update.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsUpdateComponent {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  private readonly isFetchingSubject = new BehaviorSubject<boolean>(false);

  protected readonly isFetchingChanges: Observable<boolean> =
    this.isFetchingSubject.asObservable().pipe(shareReplay(1));

  protected readonly countdownChanges: Observable<number> =
    this.isFetchingChanges.pipe(
      switchMap((isFetching) =>
        isFetching
          ? timer(0, 1000).pipe(
              map((elapsed) => 60 - elapsed),
              takeWhile((remaining) => remaining >= 0),
              startWith(60),
            )
          : timer(0).pipe(map(() => 0)),
      ),
    );

  protected selectedFile: File | null = null;

  protected readonly signals = pipSignals;

  protected async fetchLatestUpdateLinks(): Promise<void> {
    const isFetching = await firstValueFrom(this.isFetchingChanges);
    if (isFetching) {
      return;
    }

    this.isFetchingSubject.next(true);

    logMessage('Fetching latest update links.');

    const upgradeUrl =
      'https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=upgrade.zip';
    const releaseUrl =
      'https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=release.zip';

    try {
      const upgradeResponse = await fetch(upgradeUrl);
      const upgradeFileName = await upgradeResponse.text();
      const upgradeLink = `https://thewandcompany.com/pip-boy/upgrade/${upgradeFileName.trim()}`;

      const releaseResponse = await fetch(releaseUrl);
      const releaseFileName = await releaseResponse.text();
      const releaseLink = `https://thewandcompany.com/pip-boy/upgrade/${releaseFileName.trim()}`;

      logLink('Latest Upgrade ZIP', upgradeLink);
      logLink('Latest Full Firmware ZIP', releaseLink);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logMessage('Error fetching firmware links: ' + message);
    }

    // Re-enable the button after 60 seconds
    timer(60000).subscribe(() => this.isFetchingSubject.next(false));
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  protected async uploadZipToDevice(): Promise<void> {
    if (this.selectedFile) {
      this.signals.isUploadingFile.set(true);

      await this.pipDeviceService.clearScreen('Uploading Zip.');
      await this.pipFileService.uploadZipToDevice(this.selectedFile);
      await wait(1000);
      logMessage('Update complete! Restarting...');
      await wait(1000);
      await this.pipDeviceService.restart();

      this.signals.isUploadingFile.set(false);
    } else {
      logMessage('No file selected.');
    }
  }
}
