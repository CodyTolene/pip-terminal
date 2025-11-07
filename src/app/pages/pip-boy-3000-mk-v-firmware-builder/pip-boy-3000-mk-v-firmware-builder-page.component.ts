import { PAGES } from 'src/app/routing';
import { PipConnectionService } from 'src/app/services';
import { logMessage } from 'src/app/utilities';

import { Component, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ScriptsService } from 'src/app/services/scripts.service';

// Declare global functions from the patcher.js library
declare global {
  interface Window {
    Patches: any;
    PATCH_MANIFEST: any;
    FW_VERSIONS: any;
    initCFWBuilder: () => void;
  }
}

// Globals provided by the builder scripts are 'const' in the global scope
// and are not properties on window. Declare them so TS allows access.
declare const PATCH_MANIFEST: any;
declare const FW_VERSIONS: any;

@Component({
  selector: 'pip-boy-3000-mk-v-firmware-builder-page',
  templateUrl: './pip-boy-3000-mk-v-firmware-builder-page.component.html',
  imports: [PipLogComponent, PipTitleComponent, RouterModule],
  styleUrl: './pip-boy-3000-mk-v-firmware-builder-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVFirmwareBuilderPageComponent implements OnDestroy {
  private readonly basePath =
    '/app/components/companion/actions-firmware-builder/';
  private initialized = false;
  public constructor() {
    this.scriptsService.loadScript('pip/webtools/uart.js');

    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for ' +
        'commercial purposes. Use of any materials is at your own risk.',
    );
    logMessage('Loading Firmware Builder...');

    // Initialize window.Patches object
    if (!window.Patches) {
      window.Patches = {};
    }

    // Load all required scripts for the firmware builder
    this.loadFirmwareBuilderScripts();
  }

  private readonly pipConnectionService = inject(PipConnectionService);
  private scriptsService = inject(ScriptsService);

  protected readonly PAGES = PAGES;

  private loadFirmwareBuilderScripts(): void {
    // Load scripts in sequence
    const scripts = [
      `${this.basePath}Patches/patch_manifest.js`,
      `${this.basePath}Firmware/fw_manifest.js`,
      `${this.basePath}libs/acorn/acorn.js`,
      `${this.basePath}EspruinoTools/espruino.js`,
      `${this.basePath}EspruinoTools/core/config.js`,
      `${this.basePath}EspruinoTools/core/utils.js`,
      `${this.basePath}EspruinoTools/core/env.js`,
      `${this.basePath}EspruinoTools/libs/esprima/esprima.js`,
      `${this.basePath}EspruinoTools/libs/esprima/esmangle.js`,
      `${this.basePath}EspruinoTools/libs/esprima/escodegen.js`,
      `${this.basePath}EspruinoTools/plugins/minify.js`,
      `${this.basePath}EspruinoTools/plugins/pretokenise.js`,
      `${this.basePath}patcher.js`,
    ];

    // Load scripts sequentially
    let scriptsLoaded = 0;
    const loadNextScript = () => {
      if (scriptsLoaded < scripts.length) {
        this.scriptsService.loadScript(scripts[scriptsLoaded]).then(() => {
          scriptsLoaded++;
          loadNextScript();
        });
      } else {
        // Before initializing the builder, prefix relative paths in manifests
        this.prefixManifestPaths();
        // Provide a shim for Espruino.Plugins.Minify.preminify expected by patcher.js
        this.attachPreminifyShim();
        // All scripts loaded, initialize the builder
        this.initializeBuilder();
      }
    };

    loadNextScript();
  }

  private initializeBuilder(): void {
    if (this.initialized) return;
    this.initialized = true;
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (typeof window.initCFWBuilder === 'function') {
        window.initCFWBuilder();
        // After builder populates the UI, fix firmware option paths and dedupe
        this.fixFirmwareOptionPaths();
        this.dedupeFirmwareOptions();
        logMessage('Firmware Builder initialized successfully.');
      } else {
        logMessage('Error: Firmware Builder could not be initialized.');
      }
    }, 100);
  }

  /**
   * Prefix relative paths in PATCH_MANIFEST with the served assets base path.
   * This avoids 404s when patcher.js dynamically loads patch scripts.
   */
  private prefixManifestPaths(): void {
    try {
      const manifest =
        typeof PATCH_MANIFEST !== 'undefined'
          ? PATCH_MANIFEST
          : window.PATCH_MANIFEST && typeof window.PATCH_MANIFEST === 'object'
            ? window.PATCH_MANIFEST
            : undefined;
      if (!manifest) return;
      for (const key of Object.keys(manifest)) {
        const info = manifest[key];
        if (info && typeof info.file === 'string') {
          const file: string = info.file;
          const isAbsolute =
            /^(https?:)?\/\//.test(file) || file.startsWith('/');
          const alreadyPrefixed = file.startsWith(this.basePath);
          if (!isAbsolute && !alreadyPrefixed) {
            info.file = `${this.basePath}${file}`;
          }
        }
      }
    } catch (e) {
      // Non-fatal: manifest path adjustment
      console.warn('Could not adjust PATCH_MANIFEST paths:', e);
    }
  }

  /**
   * Ensure firmware <select> option values point at our assets base path
   * so fetch() resolves correctly (e.g., app/components/.../Firmware/FW_1.29.js).
   */
  private fixFirmwareOptionPaths(): void {
    const select = document.getElementById(
      'fw-select',
    ) as HTMLSelectElement | null;
    if (!select) return;
    for (let i = 0; i < select.options.length; i++) {
      const opt = select.options[i];
      const v = opt.value;
      if (!v) continue;
      const isAbsolute = /^(https?:)?\/\//.test(v);
      const alreadyAbsolutePath = v.startsWith('/');
      const alreadyPrefixed = v.startsWith(this.basePath);
      if (!isAbsolute && !alreadyPrefixed) {
        // Make it an absolute path under our assets base
        const trimmed = v.replace(/^\/+/, '');
        opt.value = alreadyAbsolutePath ? v : `${this.basePath}${trimmed}`;
      }
    }
  }

  /**
   * Remove duplicate firmware options if init was accidentally called twice
   * or if the list was populated multiple times.
   */
  private dedupeFirmwareOptions(): void {
    const select = document.getElementById(
      'fw-select',
    ) as HTMLSelectElement | null;
    if (!select) return;
    const seen = new Set<string>();
    // Skip index 0 placeholder
    for (let i = select.options.length - 1; i >= 1; i--) {
      const opt = select.options[i];
      const key = `${opt.text}::${opt.value}`;
      if (seen.has(key)) {
        select.remove(i);
      } else {
        seen.add(key);
      }
    }
  }

  public async ngOnDestroy(): Promise<void> {
    this.scriptsService.unloadAll();
    // Disconnect from the Pip-Boy if there's an active connection
    if (this.pipConnectionService.connection?.isOpen) {
      await this.pipConnectionService.disconnect();
    }
  }

  /**
   * Provide a simple offline minifier compatible with patcher.js expectations.
   * It uses esprima/esmangle/escodegen if available. If anything fails, returns the original code.
   */
  private attachPreminifyShim(): void {
    try {
      const w = window as any;
      const Espr = w.Espruino || (w.Espruino = {});
      Espr.Plugins = Espr.Plugins || {};
      Espr.Plugins.Minify = Espr.Plugins.Minify || {};
      if (typeof Espr.Plugins.Minify.preminify !== 'function') {
        Espr.Plugins.Minify.preminify = (code: string) => {
          try {
            if (
              typeof (w as any).esprima === 'undefined' ||
              typeof (w as any).esmangle === 'undefined' ||
              typeof (w as any).escodegen === 'undefined'
            ) {
              return code;
            }
            // Parse -> mangle/optimize -> generate
            const syntax = (w as any).esprima.parse(code, {
              raw: true,
              loc: false,
            });
            // Compatibility shim for esmangle versions
            if (
              typeof (w as any).esmangle.require === 'undefined' &&
              (w as any).esmangle.pass &&
              (w as any).esmangle.pass.require
            ) {
              (w as any).esmangle.require = (w as any).esmangle.pass.require;
            }
            const optimised = (w as any).esmangle.mangle(
              (w as any).esmangle.optimize(syntax, null, {
                destructive: true,
                directive: true,
                preserveCompletionValue: false,
                legacy: false,
                topLevelContext: false,
                inStrictCode: false,
              }),
            );
            const out = (w as any).escodegen.generate(optimised, {
              format: {
                renumber: true,
                hexadecimal: true,
                escapeless: false,
                indent: { style: '' },
                quotes: 'auto',
                compact: true,
                semicolons: false,
                parentheses: false,
              },
            });
            return out || code;
          } catch (_e) {
            return code;
          }
        };
      }
    } catch (e) {
      // Non-fatal if we can't attach the shim
      console.warn('Minify shim not attached:', e);
    }
  }
}
