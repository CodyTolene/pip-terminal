import { PAGES } from 'src/app/routing';
import { PipConnectionService } from 'src/app/services';
import { logMessage } from 'src/app/utilities';

import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ScriptsService } from 'src/app/services/scripts.service';

interface WindowWithCFW extends Window {
  CFW_BUILDER_BASE_PATH?: string;
  pipTerminalLog?: typeof logMessage;
  Espruino?: {
    init: () => void;
    initialised?: boolean;
    Core?: {
      Serial?: {
        isConnected: () => boolean;
        close: () => void;
      };
    };
  };
}

declare const window: WindowWithCFW;

@Component({
  selector: 'pip-boy-3000-mk-v-cfw-builder-page',
  templateUrl: './pip-boy-3000-mk-v-cfw-builder-page.component.html',
  imports: [PipLogComponent, PipTitleComponent, RouterModule],
  styleUrl: './pip-boy-3000-mk-v-cfw-builder-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVCfwBuilderPageComponent implements OnInit, OnDestroy {
  public constructor() {
    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for ' +
        'commercial purposes. Use of any materials is at your own risk.',
    );
    logMessage('CFW Builder initializing...');
  }

  private static cfwScriptsLoaded = false;

  protected readonly PAGES = PAGES;

  private readonly pipConnectionService = inject(PipConnectionService);
  private readonly scriptsService = inject(ScriptsService);
  private originalConsoleLog?: (...args: unknown[]) => void;
  private isDestroyed = false;
  private espruinoInitCheckInterval?: ReturnType<typeof setInterval>;
  private domContentLoadedTimeout?: ReturnType<typeof setTimeout>;

  public async ngOnInit(): Promise<void> {
    // Load CFW Builder scripts from submodule (only once globally)
    await this.loadCfwBuilderScripts();
    logMessage(
      'CFW Builder initialized. Terminal online and ready to connect.',
    );
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;

    // Clear any pending DOMContentLoaded dispatch
    if (this.domContentLoadedTimeout) {
      clearTimeout(this.domContentLoadedTimeout);
      this.domContentLoadedTimeout = undefined;
    }

    // Clear any pending Espruino initialization check
    if (this.espruinoInitCheckInterval) {
      clearInterval(this.espruinoInitCheckInterval);
      this.espruinoInitCheckInterval = undefined;
    }

    // Disconnect from Espruino serial connection if active
    // This is critical to prevent connection conflicts when returning to the page
    if (window.Espruino?.Core?.Serial) {
      try {
        if (window.Espruino.Core.Serial.isConnected()) {
          window.Espruino.Core.Serial.close();
          logMessage('Espruino serial connection closed');
        }
      } catch (err) {
        console.error('Error closing Espruino serial connection:', err);
      }
    }

    // Restore console.log immediately if we hooked it
    if (this.originalConsoleLog) {
      // eslint-disable-next-line no-console
      console.log = this.originalConsoleLog;
      this.originalConsoleLog = undefined;
    }

    // Disconnect from PipConnectionService (fire-and-forget for backward compatibility)
    if (this.pipConnectionService.connection?.isOpen) {
      this.pipConnectionService.disconnect().catch((err) => {
        console.error('Error during disconnect:', err);
      });
    }
  }

  private async loadCfwBuilderScripts(): Promise<void> {
    // Check if scripts were already loaded globally
    const scriptsAlreadyLoaded =
      PipBoy3000MkVCfwBuilderPageComponent.cfwScriptsLoaded;

    // Set base path and logMessage - these need to be set every time
    window.CFW_BUILDER_BASE_PATH = 'Pip-Boy-CFW-Builder/';
    window.pipTerminalLog = logMessage;

    // Hook console.log to also send firmware write progress to terminal
    // This must be set up on every component initialization, not just first load
    if (!this.isDestroyed && !this.originalConsoleLog) {
      // eslint-disable-next-line no-console
      this.originalConsoleLog = console.log;
      // eslint-disable-next-line no-console
      console.log = (...args: unknown[]): void => {
        if (this.originalConsoleLog) {
          this.originalConsoleLog(...args);
        }

        // Send specific firmware-related messages to terminal
        const message = args.join(' ');
        if (
          message.includes('Wrote chunk') ||
          message.includes('written to flash') ||
          message.includes('Uploaded') ||
          message.includes('Uploading')
        ) {
          logMessage(message);
        } else if (message.includes('Device connected:')) {
          // Special handling for connection message with JSON object
          logMessage('Pip-Boy connected successfully');
        } else if (message.includes('Disconnected')) {
          // Special handling for connection message with JSON object
          logMessage('Pip-Boy disconnected');
        }
      };
    }

    // Only load scripts once globally to prevent redeclaration errors
    if (!scriptsAlreadyLoaded) {
      PipBoy3000MkVCfwBuilderPageComponent.cfwScriptsLoaded = true;

      // Load Acorn (JavaScript parser)
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/libs/acorn/acorn.js',
      );

      // Load Espruino core
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/espruino.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/core/serial.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/core/serial_web_serial.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/core/config.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/core/utils.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/core/env.js',
      );

      // Load Espruino plugins
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/plugins/minify.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/plugins/pretokenise.js',
      );

      // Initialize Espruino after all core and plugin files are loaded
      // This is needed because espruino.js expects DOMContentLoaded which has already fired
      // We need to wait for initialization to complete before loading patcher
      await new Promise<void>((resolve) => {
        if (window.Espruino?.init) {
          window.Espruino.init();
          // Wait for initialization to complete (Espruino.initialised flag)
          let attempts = 0;
          const maxAttempts = 50; // 50 * 100ms = 5 seconds
          this.espruinoInitCheckInterval = setInterval(() => {
            if (this.isDestroyed) {
              // Component was destroyed, stop checking
              if (this.espruinoInitCheckInterval) {
                clearInterval(this.espruinoInitCheckInterval);
                this.espruinoInitCheckInterval = undefined;
              }
              resolve();
            } else if (window.Espruino?.initialised) {
              if (this.espruinoInitCheckInterval) {
                clearInterval(this.espruinoInitCheckInterval);
                this.espruinoInitCheckInterval = undefined;
              }
              resolve();
            } else if (++attempts >= maxAttempts) {
              if (this.espruinoInitCheckInterval) {
                clearInterval(this.espruinoInitCheckInterval);
                this.espruinoInitCheckInterval = undefined;
              }
              console.warn('Espruino did not initialise after 5 seconds');
              resolve();
            }
          }, 100);
        } else {
          console.warn('Espruino object not found or init method missing');
          resolve();
        }
      });

      // Load Esprima libraries
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/esprima.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/esmangle.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/EspruinoTools/libs/esprima/escodegen.js',
      );

      // Load untokenize.js which adds preminify to Espruino.Plugins.Minify
      await this.scriptsService.loadScript('Pip-Boy-CFW-Builder/untokenize.js');

      // Load manifests
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/Patches/patch_manifest.js',
      );
      await this.scriptsService.loadScript(
        'Pip-Boy-CFW-Builder/Firmware/fw_manifest.js',
      );

      // Load UI and patcher scripts
      await this.scriptsService.loadScript('Pip-Boy-CFW-Builder/ui.js');
      await this.scriptsService.loadScript('Pip-Boy-CFW-Builder/patcher.js');
    }

    // The patcher.js listens for DOMContentLoaded which has already fired.
    // We need to trigger initialization by dispatching the event after scripts load.
    // This must happen EVERY time the component initializes, not just on first load,
    // because the event listeners need to be re-attached to the new DOM elements.
    if (document.readyState === 'complete' && !this.isDestroyed) {
      // Use setTimeout to ensure script execution context is ready
      this.domContentLoadedTimeout = setTimeout(() => {
        this.domContentLoadedTimeout = undefined;
        if (!this.isDestroyed) {
          const event = new Event('DOMContentLoaded', {
            bubbles: true,
            cancelable: true,
          });
          window.document.dispatchEvent(event);
        }
      }, 100);
    }
  }
}
