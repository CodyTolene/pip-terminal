import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  firstValueFrom,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeWhile,
  timer,
} from 'rxjs';
import { wait } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';

import { PipDeviceService } from 'src/app/services/pip/pip-device.service';
import { PipFileService } from 'src/app/services/pip/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logLink, logMessage } from 'src/app/utilities/pip-log.util';

@UntilDestroy()
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
    PipFileUploadComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './pip-actions-update.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsUpdateComponent implements OnInit {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  private readonly isFetchingSubject = new BehaviorSubject<boolean>(false);

  protected readonly formControl = new FormControl<FileList | null>(null);
  protected readonly signals = pipSignals;

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

  protected readonly disabledChanges = combineLatest([
    toObservable(pipSignals.disableAllControls),
    toObservable(pipSignals.isConnected),
    toObservable(pipSignals.isUploadingFile),
  ]).pipe(
    map(
      ([disableAllControls, isConnected, isUploadingFile]) =>
        !isConnected || disableAllControls || isUploadingFile,
    ),
    shareReplay(1),
    untilDestroyed(this),
  );

  public ngOnInit(): void {
    this.disabledChanges.pipe(untilDestroyed(this)).subscribe((disabled) => {
      if (disabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    });
  }

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

  protected async uploadZipToDevice(): Promise<void> {
    const fileList = this.formControl.value;
    if (!fileList || fileList.length === 0) {
      logMessage('No file selected.');
      return;
    }
    const file = fileList[0];

    this.signals.isUploadingFile.set(true);

    await this.pipDeviceService.clearScreen('Uploading Zip.');
    await this.pipFileService.uploadZipToDevice(file);
    await wait(1000);
    logMessage('Update complete! Restarting...');
    await wait(1000);
    await this.pipDeviceService.restart();

    this.signals.isUploadingFile.set(false);
  }
}
