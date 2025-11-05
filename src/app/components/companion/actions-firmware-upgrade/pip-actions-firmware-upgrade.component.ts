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
} from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { isNonEmptyValue, wait } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
} from '@angular/core';
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

const DEBUG = false;

@UntilDestroy()
@Component({
  selector: 'pip-actions-firmware-upgrade',
  templateUrl: './pip-actions-firmware-upgrade.component.html',
  styleUrl: './pip-actions-firmware-upgrade.component.scss',
  standalone: true,
  imports: [
    CommonModule,
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
    effect(() => {
      this.progressPct.set(pipSignals.updateProgress());
    });
  }

  private readonly fileSvc = inject(PipFileService);
  private readonly deviceSvc = inject(PipDeviceService);
  private readonly connSvc = inject(PipConnectionService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _controllers = new Set<AbortController>();
  private _writeQueue: Promise<void> = Promise.resolve<void>(undefined);
  private _suppressPipDraws = false;

  protected readonly releases = releases;
  protected override readonly formGroup = pipActionsFirmwareFormGroup;

  protected readonly isUpgrading = signal(false);
  protected readonly statusText = signal<string>('');
  protected readonly progressPct = signal<number>(0);

  public ngOnInit(): void {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateFormControlState();
    });

    this.destroyRef.onDestroy((): void => {
      for (const c of this._controllers) {
        try {
          c.abort();
        } catch (e: unknown) {
          this.logWarn('Error aborting controller during teardown', e);
        }
      }
      this._controllers.clear();
    });
  }

  public async onClearCustomFirmwareClick(): Promise<void> {
    this.formGroup.controls.customFirmware.setValue(null);
  }

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

    try {
      this.isUpgrading.set(true);
      pipSignals.disableAllControls.set(true);
      pipSignals.isUploadingFile.set(true);
      pipSignals.updateProgress.set(0);

      // Suppress decorative UART draws during the critical path
      this._suppressPipDraws = true;

      await this.clearAndBanner('Preparing firmware upgrade...');

      const skipMedia = !!this.formGroup.controls.skipMediaFilesCheckbox.value;
      const eraseSd = !!this.formGroup.controls.eraseSdCardCheckbox.value;

      // Resolve ZIP
      const zipFile = await this.resolveFirmwareZip();
      if (!zipFile) return;

      // Optional erase
      if (eraseSd) {
        this.setStatus('Erasing SD card (deleting files)...');
        await this.drawOnPipSafe('   Erasing SD card...   ');
        await this.eraseSdCardOrFallback();
        await this.waitForSdIdle({ timeoutMs: 45000 });
        await this.waitForPortIdle();
      }

      // Upload
      this.setStatus('Uploading release ZIP contents...');
      await this.uploadReleaseZip(zipFile, { skipMedia });

      // Full release, reflash
      await this.assertAndStartFullReleaseReflash(zipFile);

      this.setStatus('Done.');
    } catch (e: unknown) {
      const message = this.toErrorMessage(e);
      this.setStatus(`Upgrade failed: ${message}`);
      await this.drawOnPipSafe(
        `   Upgrade failed: ${this.safeTruncate(message, 28)}   `,
      );
    } finally {
      this._suppressPipDraws = false;
      pipSignals.updateProgress.set(0);
      pipSignals.isUploadingFile.set(false);
      pipSignals.disableAllControls.set(false);
      this.isUpgrading.set(false);
      this.progressPct.set(0);
    }
  }

  private async waitForPortIdle(): Promise<void> {
    const OK_STREAK = 3;
    const MAX_MS = 20000;
    const start = Date.now();
    let streak = 0;

    while (Date.now() - start < MAX_MS) {
      try {
        await this.writeDevice('\x10void(0);\n');
        streak += 1;
        if (streak >= OK_STREAK) return;
      } catch (e: unknown) {
        streak = 0;
        this.logDebug('waitForPortIdle transient write failure', e);
      }
      await wait(150);
    }
    this.logWarn(
      'waitForPortIdle timed out, continuing with retries in sendFileToDevice',
    );
  }

  private async waitForSdIdle(opts: { timeoutMs: number }): Promise<void> {
    const { timeoutMs } = opts;
    const start = Date.now();
    let lastCount = -1;
    let stableTicks = 0;

    while (Date.now() - start < timeoutMs) {
      try {
        const tree = await this.fileSvc.getTree('');
        const count = tree.length;
        if (count === lastCount) {
          stableTicks += 1;
          if (stableTicks >= 3) return;
        } else {
          stableTicks = 0;
          lastCount = count;
        }
      } catch (e: unknown) {
        this.logDebug('waitForSdIdle tree read not ready', e);
        stableTicks = 0;
      }
      await wait(250);
    }
    this.logWarn('waitForSdIdle timed out, proceeding with upload anyway');
  }

  private async writeDevice(chunk: string): Promise<void> {
    const MAX_RETRIES = 12;
    const BASE_MS = 120;
    this._writeQueue = this._writeQueue.then(async (): Promise<void> => {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          await this.connSvc.connection?.write(chunk);
          await wait(20);
          return;
        } catch (e: unknown) {
          const msg = this.toErrorMessage(e);
          if (msg.includes('Writable stream is locked')) {
            const delay = BASE_MS * Math.pow(1.5, attempt);
            await wait(Math.min(delay, 1500));
            continue;
          }
          if (!this.connSvc.connection?.isOpen) {
            throw new Error('Connection closed during write.');
          }
          const delay = BASE_MS * Math.pow(1.3, attempt);
          await wait(Math.min(delay, 1000));
        }
      }
      throw new Error('UART write failed after retries.');
    });
    return this._writeQueue;
  }

  private newAbortController(): AbortController {
    const c = new AbortController();
    this._controllers.add(c);
    // remove after event loop tick to avoid leaks in unusual paths
    setTimeout(() => {
      this._controllers.delete(c);
    }, 0);
    return c;
  }

  private async fetchWithAutoAbort(
    url: string,
    init?: RequestInit,
  ): Promise<Response | null> {
    const ctrl = this.newAbortController();
    try {
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      return res;
    } catch (e: unknown) {
      const err = e as Error;
      if (err && err.name === 'AbortError') {
        this.setStatus('Canceled network request (navigation or teardown).');
        return null;
      }
      throw e;
    } finally {
      this._controllers.delete(ctrl);
    }
  }

  private async resolveFirmwareZip(): Promise<File | null> {
    const selectedUrl = this.formGroup.controls.firmwareDropdown.value;
    if (isNonEmptyValue(selectedUrl)) {
      this.setStatus('Fetching release ZIP...');
      const url = String(selectedUrl);
      const res = await this.fetchWithAutoAbort(url, { cache: 'no-store' });
      if (res === null) return null;
      if (!res.ok) throw new Error(`Failed to fetch ZIP: ${res.status}`);
      const blob = await res.blob();
      const name = url.split('/').pop() || 'release.zip';
      return new File([blob], name, { type: blob.type || 'application/zip' });
    }

    const files = this.formGroup.controls.customFirmware
      .value as unknown as FileList | null;
    if (files && files.length > 0) {
      return files[0];
    }

    this.setStatus('No firmware ZIP selected.');
    return null;
  }

  private async eraseSdCardOrFallback(): Promise<void> {
    const TIME_BUDGET_MS = 12000;

    this.setStatus('Starting SD erase (tree walk)...');

    const timed = (p: Promise<void>, ms: number): Promise<void> =>
      Promise.race([
        p,
        new Promise<void>((_, reject) =>
          setTimeout(() => reject(new Error('erase timeout')), ms),
        ),
      ]);

    try {
      await timed(this.safeEraseSdCardTree(), TIME_BUDGET_MS);
      this.setStatus('SD erase completed.');
      await this.drawOnPipSafe('   SD erase completed.   ');
      return;
    } catch (e: unknown) {
      this.logWarn('Tree erase fell back to device-side erase', e);
      this.setStatus(
        'Tree erase is slow or stuck. Switching to device-side erase...',
      );
      await this.drawOnPipSafe('   Using fast erase...   ');
      await this.deviceSideEraseAll();
      this.setStatus('Fast erase completed.');
      await this.drawOnPipSafe('   SD erase completed.   ');
    }
  }

  private async safeEraseSdCardTree(): Promise<void> {
    const tree = await this.fileSvc.getTree('');
    const deleteBranch = async (
      path: string,
      type: 'file' | 'dir',
    ): Promise<void> => {
      if (type === 'file') {
        await this.fileSvc.deleteFileOnDevice(path);
      } else {
        await this.fileSvc.deleteDirectoryOnDevice(path);
      }
      await wait(5);
    };
    const walkDelete = async (
      nodes: ReadonlyArray<{ path: string; type: string; children?: Branch[] }>,
    ): Promise<void> => {
      for (const n of nodes) {
        if (n.type === 'dir') {
          await walkDelete(n.children ?? []);
          if (n.path) await deleteBranch(n.path, 'dir');
        } else {
          await deleteBranch(n.path, 'file');
        }
      }
    };
    await walkDelete(tree);
  }

  private async deviceSideEraseAll(): Promise<void> {
    const script =
      `\x10(function(){` +
      `try{` +
      `var fs=require('fs');` +
      `function rmrf(d){` +
      `  var list;` +
      `  try{list=fs.readdir(d);}catch(e){return;}` +
      `  list.forEach(function(n){` +
      `    if(!n||n[0]=='.')return;` +
      `    var p=d?d+'/'+n:n;` +
      `    var s;try{s=fs.statSync(p);}catch(e){s=null}` +
      `    if(s&&s.dir) rmrf(p); else try{fs.unlink(p);}catch(e){}` +
      `  });` +
      `  if(d) try{fs.rmdir(d);}catch(e){}` +
      `}` +
      `rmrf('');` +
      `console.log('ERASE_DONE');` +
      `}catch(e){console.log('ERASE_ERR:'+e.message);}` +
      `})();\n`;

    try {
      await this.writeDevice(script);
      await wait(500);
    } catch (e: unknown) {
      this.logWarn('deviceSideEraseAll write failed', e);
    }
  }

  private normalizePath(raw: string): string {
    const cleaned = raw.replace(/^\/+/, '');
    const parts = cleaned.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const seg of parts) {
      if (seg === '.' || seg === '') continue;
      if (seg === '..') {
        if (stack.length) stack.pop();
        continue;
      }
      stack.push(seg);
    }
    return stack.join('/');
  }

  private async safeMkdirsForFile(filePath: string): Promise<void> {
    const MAX_RETRIES = 5;
    const BASE_MS = 80;

    const normalized = this.normalizePath(filePath);
    const segments = normalized.split('/');
    segments.pop();

    let current = '';
    for (const seg of segments) {
      current = current ? `${current}/${seg}` : seg;
      let attempt = 0;
      for (;;) {
        try {
          await this.fileSvc.createDirectoryIfNonExistent(current);
          break;
        } catch (e: unknown) {
          const msg = this.toErrorMessage(e);
          const transient =
            msg.includes('Failed to list') ||
            msg.includes('Writable stream is locked') ||
            msg.includes('undefined');

          if (attempt < MAX_RETRIES && transient) {
            await wait(BASE_MS * Math.pow(1.6, attempt++));
            continue;
          }
          throw e;
        }
      }
      await wait(10);
    }
  }

  private async uploadReleaseZip(
    file: File,
    options: { skipMedia: boolean },
  ): Promise<void> {
    const { skipMedia } = options;
    this.setStatus('Preparing ZIP...');
    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);

    const entries = Object.entries(zip.files)
      .filter(([_, f]) => !f.dir)
      .filter(([p]) =>
        skipMedia ? !p.toLowerCase().match(/\.(wav|avi)$/) : true,
      )
      .map(([p, f]) => [this.normalizePath(p), f] as const);

    const topDirs = Array.from(
      new Set(entries.map(([p]) => p.split('/')[0]).filter(Boolean)),
    );
    for (const d of topDirs) {
      try {
        await this.fileSvc.createDirectoryIfNonExistent(d);
      } catch (e: unknown) {
        this.logDebug(`Top-level mkdir failed for ${d}`, e);
      }
      await wait(5);
    }

    const sizes = await Promise.all(
      entries.map(async ([, f]) => (await f.async('uint8array')).length),
    );
    const total = sizes.reduce((a, b) => a + b, 0);
    let uploaded = 0;

    for (const [normalizedPath, zf] of entries) {
      const adjustedPath = normalizedPath.endsWith('.min.js')
        ? normalizedPath.replace(/\.min\.js$/, '.js')
        : normalizedPath;

      this.setStatus(`Uploading ${adjustedPath}...`);

      await this.safeMkdirsForFile(adjustedPath);

      const data = await zf.async('uint8array');

      const MAX_RETRIES = 10;
      const BASE_MS = 120;
      let sent = 0;
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          sent = await this.fileSvc.sendFileToDevice(
            adjustedPath,
            data,
            undefined,
          );
          break;
        } catch (e: unknown) {
          const msg = this.toErrorMessage(e);
          const transient =
            msg.includes('Writable stream is locked') ||
            msg.includes('Failed to list') ||
            msg.includes('undefined');

          if (attempt < MAX_RETRIES && transient) {
            const backoff = BASE_MS * Math.pow(1.5, attempt);
            await wait(Math.min(backoff, 2000));
            continue;
          }
          throw e;
        }
      }

      if (sent === 0) {
        throw new Error(`Failed to upload ${adjustedPath}`);
      }

      uploaded += sent;
      const percent = Math.round((uploaded / total) * 100);
      pipSignals.updateProgress.set(percent >= 99 ? 100 : percent);
      await wait(40);
    }
  }

  private async fileExistsOnZip(file: File, path: string): Promise<boolean> {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const normalized = this.normalizePath(path);
    return !!zip.files[normalized] || !!zip.files[path];
  }

  private async assertAndStartFullReleaseReflash(zipFile: File): Promise<void> {
    const hasFwupdate = await this.fileExistsOnZip(zipFile, 'fwupdate.js');
    const hasBin = await this.fileExistsOnZip(zipFile, 'pipboy.bin');

    if (!hasFwupdate || !hasBin) {
      this.setStatus(
        'Selected ZIP is not a full release. Missing pipboy.bin or fwupdate.js',
      );
      await this.drawOnPipSafe('   ZIP missing req files   ');
      throw new Error(
        'ZIP must contain pipboy.bin and fwupdate.js for full release reflash',
      );
    }

    try {
      await this.writeDevice(' \x1B[2H');
      await wait(150);
    } catch (e: unknown) {
      this.logDebug('Pre-flash console clear failed', e);
    }

    this.setStatus('Finishing upgrade on device...');

    try {
      await this.writeDevice(
        "\x10eval(require('fs').readFileSync('fwupdate.js'));\n",
      );
      await wait(200);
      await this.writeDevice('\x10updateFirmware();\n');
    } catch (e: unknown) {
      this.setStatus('Failed to start firmware flasher (fwupdate.js)');
      await this.drawOnPipSafe('   Flash start FAILED   ');
      throw e;
    }

    const NOMINAL_REFLASH_SECS = 55;
    for (let s = NOMINAL_REFLASH_SECS; s > 0; s--) {
      this.setStatus(`Reflashing... ~${s}s remaining`);
      await wait(1000);
    }

    this.setStatus('Upgrade complete. Rebooting Pip-Boy...');
    await this.drawOnPipSafe('   Upgrade complete.   ');
    await this.deviceSvc.restart();
  }

  private async clearAndBanner(text: string): Promise<void> {
    try {
      await this.deviceSvc.clearScreen(text);
    } catch (e: unknown) {
      this.logDebug('clearScreen failed', e);
    }
    await this.drawOnPipSafe(`   ${this.safeTruncate(text, 26)}   `);
  }

  private async drawOnPipSafe(text: string): Promise<void> {
    if (this._suppressPipDraws) return;
    try {
      const safe = this.escapeForSingleQuotedJs(text);
      await this.writeDevice(
        `\x10g.setFontMonofonto16().clearRect(0,173,478,319).setColor(0,0.8,0).setFontAlign(0,0);\n`,
      );
      await this.writeDevice(`\x10g.drawString('${safe}',240,220,true);\n`);
    } catch (e: unknown) {
      this.logDebug('drawOnPipSafe failed', e);
    }
  }

  private setStatus(text: string): void {
    this.statusText.set('');
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

  private escapeForSingleQuotedJs(input: string): string {
    return input.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
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

  private logWarn(message: string, e?: unknown): void {
    const msg = e ? `${message}: ${this.toErrorMessage(e)}` : message;
    logMessage(msg);
    console.warn(msg);
  }

  private logDebug(message: string, e?: unknown): void {
    if (!DEBUG) return;

    const msg = e ? `${message}: ${this.toErrorMessage(e)}` : message;
    // eslint-disable-next-line no-console
    console.debug(msg);
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
