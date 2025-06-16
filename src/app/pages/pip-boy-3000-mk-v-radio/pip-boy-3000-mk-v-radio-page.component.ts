import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormDirective } from '@proangular/pro-form';
import { combineLatest, map, shareReplay } from 'rxjs';
import {
  DX_RADIO_FILE_NAMES,
  MX_RADIO_FILE_NAMES,
  PIP_SCRIPTS,
  ScriptKey,
} from 'src/app/constants';
import { DxRadioFileNameEnum, MxRadioFileNameEnum } from 'src/app/enums';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { PipActionsMiscComponent } from 'src/app/components/companion/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/companion/actions-primary/pip-actions-primary.component';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';

import { PipSoundService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-sound.service';
import { ScriptsService } from 'src/app/services/scripts.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-boy-3000-mk-v-radio-page',
  templateUrl: './pip-boy-3000-mk-v-radio-page.component.html',
  imports: [
    CommonModule,
    MatProgressBarModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipButtonComponent,
    PipFileUploadComponent,
    PipLogComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './pip-boy-3000-mk-v-radio-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVRadioPageComponent
  extends FormDirective<RadioSetFormGroup>
  implements OnInit, OnDestroy
{
  public constructor(
    private readonly formBuilder: FormBuilder,
    private readonly pipSoundService: PipSoundService,
    private scriptsService: ScriptsService,
  ) {
    super();

    const scriptKey: ScriptKey = 'uart';
    this.scriptsService.loadScript(PIP_SCRIPTS[scriptKey]);

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
    untilDestroyed(this),
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

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
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

    // Display the raw file name from the user
    logMessage(`Uploading "${file.name}" as "${wrappedFile.name}"...`);

    pipSignals.isUploadingFile.set(true);

    logMessage(`Uploading "${nameWithExtension}": 0%`);
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
