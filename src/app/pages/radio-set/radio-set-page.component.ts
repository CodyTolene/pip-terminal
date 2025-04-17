import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormDirective } from '@proangular/pro-form';
import { combineLatest, map, shareReplay } from 'rxjs';
import { DX_RADIO_FILE_NAMES, MX_RADIO_FILE_NAMES } from 'src/app/constants';
import { DxRadioFileNameEnum, MxRadioFileNameEnum } from 'src/app/enums';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip/actions-quick-nav/pip-actions-quick-nav.component';

import { PipSoundService } from 'src/app/services/pip/pip-sound.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-radio-set-page',
  templateUrl: './radio-set-page.component.html',
  imports: [
    CommonModule,
    MatProgressBarModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipButtonComponent,
    PipFileUploadComponent,
    PipLogComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './radio-set-page.component.scss',
  standalone: true,
})
export class RadioSetPageComponent
  extends FormDirective<RadioSetFormGroup>
  implements OnInit
{
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pipSoundService: PipSoundService,
  ) {
    super();

    this.formGroup = new FormGroup<RadioSetFormGroup>({
      dxFiles: this.formBuilder.array(
        DX_RADIO_FILE_NAMES.map(() => new FormControl<FileList | null>(null)),
      ),
      mxFiles: this.formBuilder.array(
        MX_RADIO_FILE_NAMES.map(() => new FormControl<FileList | null>(null)),
      ),
    });
  }

  protected override readonly formGroup: FormGroup<RadioSetFormGroup>;

  // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
  protected uploadProgress: { [key: string]: number } = {};

  protected readonly dxFileNames = DX_RADIO_FILE_NAMES;
  protected readonly mxFileNames = MX_RADIO_FILE_NAMES;

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
  );

  public ngOnInit(): void {
    this.disabledChanges.pipe(untilDestroyed(this)).subscribe((disabled) => {
      for (const dxCtrl of this.formGroup.controls.dxFiles.controls) {
        if (disabled) {
          dxCtrl.disable();
        } else {
          dxCtrl.enable();
        }
      }
      for (const mxCtrl of this.formGroup.controls.mxFiles.controls) {
        if (disabled) {
          mxCtrl.disable();
        } else {
          mxCtrl.enable();
        }
      }
    });
  }

  protected async playRadioFile(
    radioFileName: DxRadioFileNameEnum | MxRadioFileNameEnum,
  ): Promise<void> {
    logMessage(`Playing radio file "${radioFileName}".`);
    await this.pipSoundService.playRadioFile(radioFileName);
  }

  protected async uploadFile(
    name: MxRadioFileNameEnum | DxRadioFileNameEnum,
  ): Promise<void> {
    const isDx = this.dxFileNames.includes(name as DxRadioFileNameEnum);
    const index = isDx
      ? this.dxFileNames.indexOf(name as DxRadioFileNameEnum)
      : this.mxFileNames.indexOf(name as MxRadioFileNameEnum);

    const fileArray = isDx
      ? this.formGroup.controls.dxFiles
      : this.formGroup.controls.mxFiles;

    const fileList = fileArray.at(index).value;

    const file = fileList?.[0];
    if (!file) {
      logMessage(`No WAV file selected for ${name}.`);
      return;
    }

    const nameWithExtension = `${name}.wav`;
    const wrappedFile = new File([file], nameWithExtension, {
      type: 'audio/wav',
    });

    logMessage(`Uploading "${file.name}" as "${wrappedFile.name}"...`);
    pipSignals.isUploadingFile.set(true);
    this.uploadProgress[nameWithExtension] = 0;

    await this.pipSoundService.uploadRadioWavFile(wrappedFile, (progress) => {
      if (progress !== this.uploadProgress[nameWithExtension]) {
        logMessage(`Uploading "${nameWithExtension}": ${progress}%`, true);
      }
      this.uploadProgress[nameWithExtension] = progress;
    });

    this.uploadProgress[nameWithExtension] = 0;
    pipSignals.isUploadingFile.set(false);

    // Reset the input after upload
    fileArray.at(index).reset();

    logMessage(`Upload complete for "${wrappedFile.name}"!`);
    logMessage('Continue uploading, or restart the device to apply changes.');
  }
}

interface RadioSetFormGroup {
  dxFiles: FormArray<FormControl<FileList | null>>;
  mxFiles: FormArray<FormControl<FileList | null>>;
}
