import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, map, shareReplay } from 'rxjs';
import { pipSignals } from 'src/app/signals';
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

import { PipDeviceService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-device.service';
import { PipFileService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-file.service';

import { logMessage } from 'src/app/utilities/pip-log.util';

@UntilDestroy()
@Component({
  selector: 'pip-actions-zip-upload',
  templateUrl: './pip-actions-zip-upload.component.html',
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
  styleUrl: './pip-actions-zip-upload.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsZipUploadComponent implements OnInit {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  protected readonly formControl = new FormControl<FileList | null>(null);
  protected readonly signals = pipSignals;

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
    logMessage('Upload and unzip complete! Restarting...');
    await wait(1000);
    await this.pipDeviceService.restart();

    this.signals.isUploadingFile.set(false);
  }
}
