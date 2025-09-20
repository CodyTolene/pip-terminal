import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
  isNonEmptyString,
} from '@proangular/pro-form';
import {
  combineLatest,
  firstValueFrom,
  map,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { PipDeviceService, PipFileService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  FileUploadFormGroup,
  fileUploadFormGroup,
} from 'src/app/components/companion/file-uploader/pip-file-upload-form-group';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';

import { Branch } from 'src/app/types/branch';

@UntilDestroy()
@Component({
  selector: 'pip-file-uploader',
  templateUrl: './pip-file-uploader.component.html',
  styleUrls: ['./pip-file-uploader.component.scss'],
  imports: [
    CommonModule,
    InputComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    MatIconModule,
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
  private readonly pipDeviceService = inject(PipDeviceService);
  private readonly pipFileService = inject(PipFileService);

  protected override readonly formGroup = fileUploadFormGroup;

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

  protected readonly dropdownOptionsChanges = this.disabledChanges.pipe(
    switchMap(async (isDisabled) => {
      if (!isDisabled) {
        pipSignals.isReadingFile.set(true);

        logMessage('Fetching directories for file uploader...');
        const rootDir = '';
        const tree = await this.pipFileService.getTree(rootDir);
        let directories = collectAllDirectories(tree);
        logMessage(
          `Populated file uploader with ${directories.length} directories.`,
        );

        directories = directories.map((dir) => ({
          ...dir,
          path: dir.path.replace(/^\//, ''), // Remove leading slash
        }));

        // Add root directory
        directories.unshift({
          name: 'ROOT',
          path: '~',
          type: 'dir',
        });

        // Remove duplicate directories
        directories = directories.filter(
          (dir, index, self) =>
            index === self.findIndex((d) => d.path === dir.path),
        );

        pipSignals.isReadingFile.set(false);

        return directories;
      }
      return null;
    }),
    untilDestroyed(this),
  );

  public ngOnInit(): void {
    combineLatest([
      this.disabledChanges,
      this.formGroup.valueChanges.pipe(startWith(this.formGroup.value)),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([disabled, { customDirectory, dropdown }]) => {
        const skipEmit = { emitEvent: false };
        const dropdownCtrl = this.formGroup.controls.dropdown;
        const customDirCtrl = this.formGroup.controls.customDirectory;
        const filesCtrl = this.formGroup.controls.files;

        filesCtrl.enable(skipEmit);

        if (disabled) {
          filesCtrl.setValue(null, skipEmit);
          filesCtrl.disable(skipEmit);

          dropdownCtrl.setValue(null, skipEmit);
          dropdownCtrl.disable(skipEmit);
          dropdownCtrl.setValidators([Validators.required]);

          customDirCtrl.setValue(null, skipEmit);
          customDirCtrl.disable(skipEmit);
          customDirCtrl.setValidators([Validators.required]);
        } else if (isNonEmptyString(customDirectory)) {
          dropdownCtrl.setValue(null, skipEmit);
          dropdownCtrl.setValidators(null);
          dropdownCtrl.disable(skipEmit);

          customDirCtrl.enable(skipEmit);
          customDirCtrl.setValidators([Validators.required]);
        } else if (dropdown) {
          customDirCtrl.setValue(null, skipEmit);
          customDirCtrl.setValidators(null);
          customDirCtrl.disable(skipEmit);

          dropdownCtrl.enable(skipEmit);
          dropdownCtrl.setValidators([Validators.required]);
        } else {
          dropdownCtrl.enable(skipEmit);
          dropdownCtrl.setValue(null, skipEmit);
          dropdownCtrl.setValidators([Validators.required]);

          customDirCtrl.enable(skipEmit);
          customDirCtrl.setValue(null, skipEmit);
          customDirCtrl.setValidators([Validators.required]);
        }

        filesCtrl.updateValueAndValidity(skipEmit);
        dropdownCtrl.updateValueAndValidity(skipEmit);
        customDirCtrl.updateValueAndValidity(skipEmit);
      });
  }

  protected getIndentedName(path: string, isLast: boolean): string {
    if (path === '~') return '(ROOT)';
    const depth = path.split('/').length - 1;
    const prefix = isLast ? '└── ' : '├── ';
    return ' '.repeat(depth * 2) + prefix + path;
  }

  protected async uploadFilesToDevice(): Promise<void> {
    const disabled = await firstValueFrom(this.disabledChanges);
    if (disabled) {
      logMessage('Upload disabled.');
      return;
    }

    let directory =
      this.formGroup.controls.dropdown.value ??
      this.formGroup.controls.customDirectory.value;

    if (!this.formGroup.valid || !isNonEmptyString(directory)) {
      logMessage('Form is invalid.');
      return;
    }

    // If root directory is selected, set to empty string
    if (directory === '~') {
      directory = '';
    }

    const fileList = this.formGroup.controls.files.getRawValue();
    if (!fileList || fileList.length === 0) {
      logMessage('No file(s) selected.');
      return;
    }

    if (directory !== '') {
      await this.pipFileService.createDirectoryIfNonExistent(directory);
    }

    logMessage(
      `Uploading ${fileList.length} file(s) to ${directory ? directory : '(ROOT)'}.`,
    );

    pipSignals.isUploadingFile.set(true);

    await this.pipDeviceService.clearScreen('Uploading files...');

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

      const filePath = directory ? `${directory}/${file.name}` : file.name;

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

    this.formGroup.reset({}, { emitEvent: true });

    pipSignals.updateProgress.set(0);
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

function collectAllDirectories(tree: readonly Branch[]): Branch[] {
  const dirs: Branch[] = [];

  const recurse = (nodes: readonly Branch[]): void => {
    for (const node of nodes) {
      if (node.type === 'dir') {
        dirs.push(node);
        if (node.children?.length) {
          recurse(node.children);
        }
      }
    }
  };

  recurse(tree);

  // Deduplicate by full path
  const uniqueDirs = Array.from(
    new Map(dirs.map((dir) => [dir.path, dir])).values(),
  );

  // Sort alphabetically by name (case-insensitive)
  uniqueDirs.sort((a, b) =>
    a.path.localeCompare(b.path, undefined, { sensitivity: 'base' }),
  );

  return uniqueDirs;
}
