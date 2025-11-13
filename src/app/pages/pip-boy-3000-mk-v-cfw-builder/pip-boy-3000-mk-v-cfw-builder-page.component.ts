import { PAGES } from 'src/app/routing';
import { PipConnectionService } from 'src/app/services';
import { logMessage } from 'src/app/utilities';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ScriptsService } from 'src/app/services/scripts.service';

interface WindowWithCFW extends Window {
  CFW_BUILDER_BASE_PATH?: string;
  pipTerminalLog?: typeof logMessage;
  Espruino?: {
    init: () => void;
    initialised?: boolean;
  };
}

declare const window: WindowWithCFW;

@Component({
  selector: 'pip-boy-3000-mk-v-cfw-builder-page',
  templateUrl: './pip-boy-3000-mk-v-cfw-builder-page.component.html',
  imports: [
    PipLogComponent,
    PipTitleComponent,
    RouterModule,
    PipButtonComponent,
  ],
  styleUrl: './pip-boy-3000-mk-v-cfw-builder-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVCfwBuilderPageComponent implements OnInit, OnDestroy {
  public constructor() {
    this.setConsoleLogInterceptor();

    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for ' +
        'commercial purposes. Use of any materials is at your own risk.',
    );
    logMessage('CFW Builder initializing...');
  }

  private cfwScriptsLoaded = false;

  protected readonly PAGES = PAGES;

  private readonly pipConnectionService = inject(PipConnectionService);
  private readonly scriptsService = inject(ScriptsService);

  private originalConsoleLog?: (...args: unknown[]) => void;

  public async ngOnInit(): Promise<void> {
    // Load CFW Builder scripts from submodule (only once globally)
    await this.loadScripts();
    logMessage(
      'CFW Builder initialized. Terminal online and ready to connect.',
    );
  }

  public ngOnDestroy(): void {
    this.cleanUpConsoleLogInterceptor();

    this.cleanUpScripts();

    // Disconnect without waiting (fire-and-forget)
    if (this.pipConnectionService.connection?.isOpen) {
      this.pipConnectionService.disconnect().catch((err) => {
        console.error('Error during disconnect:', err);
      });
    }
  }

  private cleanUpConsoleLogInterceptor(): void {
    // Restore console.log immediately
    if (this.originalConsoleLog) {
      // eslint-disable-next-line no-console
      console.log = this.originalConsoleLog;
      this.originalConsoleLog = undefined;
    }
  }

  private cleanUpScripts(): void {
    const allScripts = [...coreScripts, ...secondaryScripts];
    for (const script of allScripts) {
      this.scriptsService.unloadScript(script);
    }
    this.cfwScriptsLoaded = false;
  }

  private async loadScripts(): Promise<void> {
    // Only load scripts once globally to prevent redeclaration errors
    if (this.cfwScriptsLoaded) {
      return;
    }
    this.cfwScriptsLoaded = true;

    // Set base path for CFW Builder resources (used by manifests)
    window.CFW_BUILDER_BASE_PATH = 'Pip-Boy-CFW-Builder/';

    // Expose logMessage to patcher.js for terminal integration
    window.pipTerminalLog = logMessage;

    // Load Initial Acorn & Espruino scripts
    for (const script of coreScripts) {
      await this.scriptsService.loadScript(script);
    }

    // Initialize Espruino after all core and plugin files are loaded
    // This is needed because espruino.js expects DOMContentLoaded which has already fired
    // We need to wait for initialization to complete before loading patcher
    await new Promise<void>((resolve) => {
      if (window.Espruino?.init) {
        window.Espruino.init();
        // Wait for initialization to complete (Espruino.initialised flag)
        let attempts = 0;
        const maxAttempts = 50; // 50 * 100ms = 5 seconds
        const checkInit = setInterval(() => {
          if (window.Espruino?.initialised) {
            clearInterval(checkInit);
            resolve();
          } else if (++attempts >= maxAttempts) {
            clearInterval(checkInit);
            console.warn('Espruino did not initialise after 5 seconds');
            resolve();
          }
        }, 100);
      } else {
        console.warn('Espruino object not found or init method missing');
        resolve();
      }
    });

    // Load secondary scripts
    for (const script of secondaryScripts) {
      await this.scriptsService.loadScript(script);
    }

    // The patcher.js listens for DOMContentLoaded which has already fired.
    // We need to trigger initialization by dispatching the event after scripts load
    if (document.readyState === 'complete') {
      // Use setTimeout to ensure script execution context is ready
      setTimeout(() => {
        const event = new Event('DOMContentLoaded', {
          bubbles: true,
          cancelable: true,
        });
        window.document.dispatchEvent(event);
      }, 100);
    }
  }

  private setConsoleLogInterceptor(): void {
    // eslint-disable-next-line no-console
    this.originalConsoleLog = console.log;

    // Intercept console.log globally for the lifetime of this component.
    // eslint-disable-next-line no-console
    console.log = (...args: unknown[]): void => {
      // Always call the original console.log
      if (this.originalConsoleLog) {
        this.originalConsoleLog(...args);
      }

      // Filtering logic for the terminal
      const message = args.join(' ');
      if (
        message.includes('Wrote chunk') ||
        message.includes('written to flash') ||
        message.includes('Uploaded') ||
        message.includes('Uploading')
      ) {
        logMessage(message);
      } else if (message.includes('Device connected:')) {
        logMessage('Pip-Boy connected successfully');
      } else if (message.includes('Disconnected')) {
        logMessage('Pip-Boy disconnected');
      }
    };
  }
}

const coreScripts = [
  // Acorn (JavaScript parser)
  'Pip-Boy-CFW-Builder/libs/acorn/acorn.js',
  // Espruino core
  'Pip-Boy-CFW-Builder/EspruinoTools/espruino.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/core/serial.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/core/serial_web_serial.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/core/config.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/core/utils.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/core/env.js',
  // Espruino modules
  'Pip-Boy-CFW-Builder/EspruinoTools/plugins/minify.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/plugins/pretokenise.js',
];

const secondaryScripts = [
  // Esprima
  'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/esprima.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/esmangle.js',
  'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/escodegen.js',
  // Untokenize.js - Adds preminify to Espruino.Plugins.Minify
  'Pip-Boy-CFW-Builder/untokenize.js',
  // Manifests
  'Pip-Boy-CFW-Builder/Patches/patch_manifest.js',
  'Pip-Boy-CFW-Builder/Firmware/fw_manifest.js',
  // Patcher
  'Pip-Boy-CFW-Builder/ui.js',
  'Pip-Boy-CFW-Builder/patcher.js',
];
