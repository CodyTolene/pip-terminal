import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

@Component({
  selector: 'pip-radio-set',
  templateUrl: './pip-radio-set.component.html',
  imports: [
    CommonModule,
    MatProgressBarModule,
    PipButtonComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-radio-set.component.scss',
  standalone: true,
})
export class PipRadioSetComponent {
  public constructor(
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  protected uploadFileInputs: { [key: string]: File | null } = {};
  protected uploadProgress: { [key: string]: number } = {};

  protected readonly dxFileNames = dxFileNames;
  protected readonly mxFileNames = mxFileNames;
  protected readonly signals = pipSignals;

  protected async connect(): Promise<void> {
    await this.pipConnectionService.connect();
    await this.pipDeviceService.initialize();
  }

  protected onUploadFileSelected(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    this.uploadFileInputs[name] = input.files?.[0] || null;
    this.uploadProgress[name] = 0;
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

    this.signals.isUploadingFile.set(true);

    await this.pipFileService.uploadWavFile(file, (progress) => {
      if (progress !== this.uploadProgress[nameWithExtension]) {
        logMessage(`Uploading ${nameWithExtension}: ${progress}%`, true);
      }
      this.uploadProgress[nameWithExtension] = progress;
    });

    this.uploadProgress[nameWithExtension] = 0;
    this.signals.isUploadingFile.set(false);
    this.uploadFileInputs[name] = null;
    this.pipDeviceService.restart();
  }
}

const dxFileNames = ['DX01', 'DX02', 'DX03'];

const mxFileNames = [
  'MX01',
  'MX02',
  'MX03',
  'MX04',
  'MX05',
  'MX06',
  'MX07',
  'MX08',
  'MX09',
  'MX10',
  'MX11',
  'MX12',
  'MX13',
  'MX14',
  'MX15',
  'MX16',
];
