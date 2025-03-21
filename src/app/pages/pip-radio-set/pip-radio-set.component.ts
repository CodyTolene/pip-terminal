import { DX_RADIO_FILE_NAMES, MX_RADIO_FILE_NAMES } from 'src/app/constants';
import { DxRadioFileNameEnum, MxRadioFileNameEnum } from 'src/app/enums';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipActionsMiscComponent } from 'src/app/components/pip-actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip-actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip-actions-quick-nav/pip-actions-quick-nav.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { PipSoundService } from 'src/app/services/pip-sound.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-radio-set',
  templateUrl: './pip-radio-set.component.html',
  imports: [
    CommonModule,
    MatProgressBarModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipButtonComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-radio-set.component.scss',
  standalone: true,
})
export class PipRadioSetComponent {
  public constructor(private readonly pipSoundService: PipSoundService) {}

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  protected uploadFileInputs: { [key: string]: File | null } = {};

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  protected uploadProgress: { [key: string]: number } = {};

  protected readonly DxRadioFileNameEnum = DxRadioFileNameEnum;
  protected readonly MxRadioFileNameEnum = MxRadioFileNameEnum;

  protected readonly dxFileNames = DX_RADIO_FILE_NAMES;
  protected readonly mxFileNames = MX_RADIO_FILE_NAMES;

  protected readonly signals = pipSignals;

  protected onUploadFileSelected(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    this.uploadFileInputs[name] = input.files?.[0] || null;
    this.uploadProgress[name] = 0;
  }

  protected async playRadioFileOnDevice(
    radioFileName: DxRadioFileNameEnum | MxRadioFileNameEnum,
  ): Promise<void> {
    logMessage(`Playing radio file "${radioFileName}"...`);
    await this.pipSoundService.playRadioFileOnDevice(radioFileName);
  }

  protected async uploadFile(name: string): Promise<void> {
    const pendingFile = this.uploadFileInputs[name];
    if (!pendingFile) {
      logMessage(`No WAV file selected for ${name}.`);
      return;
    }

    const nameWithExtension = `${name}.wav`;
    const file = new File([pendingFile], nameWithExtension, {
      type: 'audio/wav',
    });

    // Display the raw file name from the user
    logMessage(`Uploading "${pendingFile.name}" as "${file.name}"...`);

    this.signals.isUploadingFile.set(true);

    logMessage(`Uploading "${nameWithExtension}": 0%`);

    await this.pipSoundService.uploadRadioWavFile(file, (progress) => {
      if (progress !== this.uploadProgress[nameWithExtension]) {
        logMessage(`Uploading "${nameWithExtension}": ${progress}%`, true);
      }
      this.uploadProgress[nameWithExtension] = progress;
    });

    this.uploadProgress[nameWithExtension] = 0;
    this.signals.isUploadingFile.set(false);
    this.uploadFileInputs[name] = null;

    logMessage(`Upload complete for "${file.name}"!`);
    logMessage('Continue uploading, or restart the device to apply changes.');
  }
}
