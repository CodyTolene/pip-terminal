import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { combineLatest, map, shareReplay } from 'rxjs';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';

import { PipDeviceService } from 'src/app/services/pip/pip-device.service';
import { PipFileService } from 'src/app/services/pip/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-file-uploader',
  templateUrl: './pip-file-uploader.component.html',
  styleUrls: ['./pip-file-uploader.component.scss'],
  imports: [
    CommonModule,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    PipButtonComponent,
    PipFileUploadComponent,
    ReactiveFormsModule,
  ],
  providers: [],
  standalone: true,
})
export class PipFileUploaderComponent
  extends FormDirective<FileUploadFormGroup>
  implements OnInit
{
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {
    super();
  }

  protected override readonly formGroup = formGroup;

  // TODO: Make this dynamic
  protected readonly dropdownOptions = [
    'ALARM',
    'APPINFO',
    'BOOT',
    'DATA',
    'INV',
    'LOGS',
    'MAP',
    'MISC',
    'RADIO',
    'STAT',
    'UI',
    'USER',
    'USER_BOOT',
  ];

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
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    });
  }

  protected async uploadFilesToDevice(path: string | null): Promise<void> {
    const fileList = this.formGroup.controls.files.getRawValue();
    if (!fileList || fileList.length === 0) {
      logMessage('No file(s) selected.');
      return;
    } else if (!path) {
      logMessage('No path provided.');
      return;
    }

    await this.pipFileService.createDirectoryIfNonExistent(path);

    logMessage(`Uploading ${fileList.length} file(s) to ${path}.`);

    pipSignals.isUploadingFile.set(true);

    await this.pipDeviceService.clearScreen('Starting upload...');

    const fileSizes = Array.from(fileList).map((file) => file.size);
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);

    let run = 0;
    let currentFile: File | null = null;
    let uploaded = 0;

    for (const file of Array.from(fileList)) {
      logMessage(`Uploading file: ${file.name}`);

      let fileData: Uint8Array;
      try {
        fileData = await readFileAsUint8Array(file);
      } catch (error) {
        logMessage(
          `Failed to read file ${file.name}: ${(error as Error).message}`,
        );
        return;
      }

      const filePath = `${path}/${file.name}`;

      logMessage(`Uploading ${file.name}: 0%`);

      const uploadedSize = await this.pipFileService.sendFileToDevice(
        filePath,
        fileData,
        (chunkPercent) => {
          // Individual file progress
          const filePercent = Math.round(chunkPercent);
          logMessage(`Uploading ${file.name}: ${filePercent}%`, true);

          // Total upload progress across all files
          const totalPercent = Math.round(
            ((uploaded + fileData.length * (chunkPercent / 100)) / totalSize) *
              100,
          );
          pipSignals.updateProgress.set(totalPercent);
        },
      );

      if (uploadedSize === 0) {
        logMessage(`Failed to upload ${filePath}. Aborting.`);
        return;
      }

      uploaded += uploadedSize;

      run = currentFile === file ? run + 1 : 0;
      currentFile = file;
    }

    logMessage('Upload complete!');
    await this.pipDeviceService.clearScreen(
      'Completed! Continue uploading',
      'or restart to apply changes.',
      { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
    );

    pipSignals.isUploadingFile.set(false);
  }
}

function readFileAsUint8Array(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('FileReader result is not an ArrayBuffer.'));
      }
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error('FileReader error.'));
    };

    reader.readAsArrayBuffer(file);
  });
}

interface FileUploadFormGroup {
  dropdown: FormControl<string | null>;
  files: FormControl<FileList | null>;
}

const formGroup = new FormGroup<FileUploadFormGroup>({
  dropdown: new FormControl<string | null>(null, [Validators.required]),
  files: new FormControl<FileList | null>(null, [Validators.required]),
});
