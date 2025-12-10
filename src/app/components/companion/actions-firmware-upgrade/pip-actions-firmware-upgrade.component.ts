import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import JSZip from 'jszip';
import {
  PipConnectionService,
  PipDeviceService,
  PipFileService,
  PipFirmwareService,
} from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { isNonEmptyValue, wait } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { Branch } from 'src/app/types/branch';

import { logMessage } from 'src/app/utilities/pip-log.util';

import {
  PipActionsFirmwareFormGroup,
  pipActionsFirmwareFormGroup,
} from './pip-actions-firmware-formgroup';

@UntilDestroy()
@Component({
  selector: 'pip-actions-firmware-upgrade',
  templateUrl: './pip-actions-firmware-upgrade.component.html',
  styleUrl: './pip-actions-firmware-upgrade.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    MatProgressBarModule,
    PipButtonComponent,
    PipFileUploadComponent,
    PipTitleComponent,
    ReactiveFormsModule,
  ],
})
export class PipActionsFirmwareUpgradeComponent
  extends FormDirective<PipActionsFirmwareFormGroup>
  implements OnInit
{
  public constructor() {
    super();
    // Mirror global progress signal
    effect(() => {
      this.progressPct.set(pipSignals.updateProgress());
    });
  }

  private readonly connSvc = inject(PipConnectionService);
  private readonly deviceSvc = inject(PipDeviceService);
  private readonly fileSvc = inject(PipFileService);
  private readonly fwSvc = inject(PipFirmwareService);

  protected readonly releases = releases;
  protected override readonly formGroup = pipActionsFirmwareFormGroup;

  protected readonly isUpgrading = signal(false);
  protected readonly statusText = signal<string>('');
  protected readonly progressPct = signal<number>(0);

  public ngOnInit(): void {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateFormControlState();
    });
  }

  public async onClearCustomFirmwareClick(): Promise<void> {
    this.formGroup.controls.customFirmware.setValue(null);
  }

  /**
   * Validates, optionally erases SD, uploads the ZIP, and triggers device flasher.
   */
  public async onUpgradeClick(): Promise<void> {
    if (this.formGroup.invalid) {
      this.highlightInvalidControls();
      this.scrollToFirstInvalidControl();
      return;
    }
    if (!this.connSvc.connection?.isOpen) {
      this.setStatus('Please connect to the Pip-Boy first.');
      return;
    }

    const skipMedia = !!this.formGroup.controls.skipMediaFilesCheckbox.value;
    const eraseSd = !!this.formGroup.controls.eraseSdCardCheckbox.value;

    try {
      this.isUpgrading.set(true);
      pipSignals.disableAllControls.set(true);
      pipSignals.isUploadingFile.set(true);
      pipSignals.updateProgress.set(0);

      await this.deviceSvc.clearScreen('Preparing firmware upgrade...');

      const zipFile = await this.resolveFirmwareZip();
      if (!zipFile) {
        this.setStatus('No firmware ZIP selected.');
        return;
      }

      if (eraseSd) {
        this.setStatus('Erasing SD card...');
        await this.eraseSdCardTree();
        await this.deviceSvc.clearScreen('SD erase completed.');
      }

      this.setStatus('Uploading release ZIP contents...');
      if (skipMedia) {
        const filtered = await this.filterZip(zipFile, /\.(wav|avi)$/i);
        await this.fileSvc.uploadZipToDevice(filtered, false);
      } else {
        await this.fileSvc.uploadZipToDevice(zipFile, false);
      }

      this.setStatus('Starting device flasher...');
      await this.fwSvc.flashFullRelease(zipFile);

      this.setStatus('Done.');
    } catch (e: unknown) {
      const message = this.toErrorMessage(e);
      this.setStatus(`Upgrade failed: ${message}`);
      await this.deviceSvc.clearScreen(
        'Upgrade failed.',
        this.safeTruncate(message, 28),
      );
    } finally {
      pipSignals.updateProgress.set(0);
      pipSignals.isUploadingFile.set(false);
      pipSignals.disableAllControls.set(false);
      this.isUpgrading.set(false);
      this.progressPct.set(0);
    }
  }

  /**
   * Dropdown or custom file to File. Fetches when a release URL is selected.
   */
  private async resolveFirmwareZip(): Promise<File | null> {
    const selectedUrl = this.formGroup.controls.firmwareDropdown.value;
    if (isNonEmptyValue(selectedUrl)) {
      this.setStatus('Fetching release ZIP...');
      const url = String(selectedUrl);
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch ZIP: ${res.status}`);
      const blob = await res.blob();
      const name = url.split('/').pop() || 'release.zip';
      return new File([blob], name, { type: blob.type || 'application/zip' });
    }

    const files = this.formGroup.controls.customFirmware
      .value as unknown as FileList | null;
    if (files && files.length > 0) return files[0];

    return null;
  }

  /**
   * Erase entire SD card tree using existing file APIs.
   */
  private async eraseSdCardTree(): Promise<void> {
    const nodes = await this.fileSvc.getTree('');
    const del = async (n: Branch): Promise<void> => {
      if (n.type === 'dir') {
        for (const c of n.children ?? []) await del(c);
        if (n.path) await this.fileSvc.deleteDirectoryOnDevice(n.path);
      } else {
        await this.fileSvc.deleteFileOnDevice(n.path);
      }
      await wait(5);
    };
    for (const n of nodes) await del(n);
  }

  /**
   * Build a new ZIP File with entries that do not match rx.
   */
  private async filterZip(file: File, rx: RegExp): Promise<File> {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const out = new JSZip();
    await Promise.all(
      Object.entries(zip.files).map(async ([p, zf]) => {
        if (zf.dir) return;
        if (rx.test(p)) return;
        const data = await zf.async('uint8array');
        out.file(p, data);
      }),
    );
    const blob = await out.generateAsync({ type: 'blob' });
    return new File([blob], file.name.replace(/\.zip$/i, '.filtered.zip'), {
      type: 'application/zip',
    });
  }

  private setStatus(text: string): void {
    this.statusText.set(text);
    logMessage(text);
  }

  private updateFormControlState(): void {
    const useOfficialFirmware = isNonEmptyValue(
      this.formGroup.controls.firmwareDropdown.value,
    );

    if (useOfficialFirmware) {
      this.formGroup.controls.customFirmware.setValue(null, {
        emitEvent: false,
      });
      this.formGroup.controls.customFirmware.disable({ emitEvent: false });
      logMessage('Using official firmware');
      return;
    } else {
      this.formGroup.controls.customFirmware.enable({ emitEvent: false });
    }

    const userCustomFirmware = isNonEmptyValue(
      this.formGroup.controls.customFirmware
        .value as unknown as FileList | null,
    );
    if (userCustomFirmware) {
      this.formGroup.controls.firmwareDropdown.setValue(null, {
        emitEvent: false,
      });
      this.formGroup.controls.firmwareDropdown.disable({ emitEvent: false });
      logMessage('Using custom firmware');
      return;
    } else {
      this.formGroup.controls.firmwareDropdown.enable({ emitEvent: false });
    }
  }

  private safeTruncate(input: string, max: number): string {
    if (input.length <= max) return input;
    return `${input.slice(0, Math.max(0, max - 3))}...`;
  }

  private toErrorMessage(e: unknown): string {
    if (e instanceof Error && typeof e.message === 'string') return e.message;
    try {
      return JSON.stringify(e);
    } catch {
      return String(e);
    }
  }
}

const releases = [
  {
    label: '2v24.413-1.12',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v24.413-1.12.zip'
      : 'firmware/release_2v24.413-1.12.zip',
  },
  {
    label: '2v25.284-1.24',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v25.284-1.24.zip'
      : 'firmware/release_2v25.284-1.24.zip',
  },
  {
    label: '2v25.359-1.29',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v25.359-1.29.zip'
      : 'firmware/release_2v25.359-1.29.zip',
  },
];
