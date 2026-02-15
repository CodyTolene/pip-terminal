import { PAGES } from 'src/app/routing';
import { PipConnectionService } from 'src/app/services';
import { logMessage } from 'src/app/utilities';

import { Component, OnDestroy, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipActionsDateTimeComponent } from 'src/app/components/companion/actions-date-time/pip-actions-date-time';
import { PipActionsMiscComponent } from 'src/app/components/companion/actions-misc/pip-actions-misc';
import { PipActionsOwnerComponent } from 'src/app/components/companion/actions-owner/pip-actions-owner';
import { PipActionsPrimaryComponent } from 'src/app/components/companion/actions-primary/pip-actions-primary';
import { PipActionsTestingComponent } from 'src/app/components/companion/actions-testing/pip-actions-testing';
import { PipLogComponent } from 'src/app/components/log/pip-log';
import { PipTitleComponent } from 'src/app/components/title/title';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-maintenance-page',
  templateUrl: './pip-boy-3000-mk-v-maintenance-page.html',
  imports: [
    PipActionsDateTimeComponent,
    PipActionsMiscComponent,
    PipActionsOwnerComponent,
    PipActionsPrimaryComponent,
    PipActionsTestingComponent,
    PipLogComponent,
    PipTitleComponent,
    RouterModule,
  ],
  styleUrl: './pip-boy-3000-mk-v-maintenance-page.scss',
  standalone: true,
})
export class PipBoy3000MkVMaintenancePage implements OnDestroy {
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

  protected readonly PAGES = PAGES;

  private readonly pipConnectionService = inject(PipConnectionService);
  private scriptsService = inject(ScriptsService);

  public async ngOnDestroy(): Promise<void> {
    this.scriptsService.unloadAll();
    // Disconnect from the Pip-Boy if there's an active connection
    if (this.pipConnectionService.connection?.isOpen) {
      await this.pipConnectionService.disconnect();
    }
  }
}
