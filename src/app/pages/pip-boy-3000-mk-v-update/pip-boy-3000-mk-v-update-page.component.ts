import { PAGES } from 'src/app/routing';
import { PipConnectionService } from 'src/app/services';
import { logMessage } from 'src/app/utilities';

import { Component, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipActionsFirmwareUpgradeComponent } from 'src/app/components/companion/actions-firmware-upgrade/pip-actions-firmware-upgrade.component';
import { PipActionsPrimaryComponent } from 'src/app/components/companion/actions-primary/pip-actions-primary.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-update-page',
  templateUrl: './pip-boy-3000-mk-v-update-page.component.html',
  imports: [
    PipActionsFirmwareUpgradeComponent,
    PipActionsPrimaryComponent,
    PipLogComponent,
    PipTitleComponent,
    RouterModule,
  ],
  styleUrl: './pip-boy-3000-mk-v-update-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVUpdatePageComponent implements OnDestroy {
  public constructor() {
    this.scriptsService.loadScript('pip/webtools/uart.js');

    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for ' +
        'commercial purposes. Use of any materials is at your own risk.',
    );
    logMessage('Terminal online and ready to connect.');
  }

  private readonly pipConnectionService = inject(PipConnectionService);
  private scriptsService = inject(ScriptsService);

  protected readonly PAGES = PAGES;

  public async ngOnDestroy(): Promise<void> {
    this.scriptsService.unloadAll();
    // Disconnect from the Pip-Boy if there's an active connection
    if (this.pipConnectionService.connection?.isOpen) {
      await this.pipConnectionService.disconnect();
    }
  }
}
