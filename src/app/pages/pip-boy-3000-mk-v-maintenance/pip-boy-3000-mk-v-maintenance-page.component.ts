import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

import { PipActionsDateTimeComponent } from 'src/app/components/companion/actions-date-time/pip-actions-date-time.component';
import { PipActionsMiscComponent } from 'src/app/components/companion/actions-misc/pip-actions-misc.component';
import { PipActionsOwnerComponent } from 'src/app/components/companion/actions-owner/pip-actions-owner.component';
import { PipActionsPrimaryComponent } from 'src/app/components/companion/actions-primary/pip-actions-primary.component';
import { PipActionsTestingComponent } from 'src/app/components/companion/actions-testing/pip-actions-testing.component';
import { PipActionsUpdateComponent } from 'src/app/components/companion/actions-update/pip-actions-update.component';
import { PipFileExplorerComponent } from 'src/app/components/companion/file-explorer/pip-file-explorer.component';
import { PipFileUploaderComponent } from 'src/app/components/companion/file-uploader/pip-file-uploader.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-maintenance-page',
  templateUrl: './pip-boy-3000-mk-v-maintenance-page.component.html',
  imports: [
    CommonModule,
    PipActionsDateTimeComponent,
    PipActionsMiscComponent,
    PipActionsOwnerComponent,
    PipActionsPrimaryComponent,
    PipActionsTestingComponent,
    PipActionsUpdateComponent,
    PipFileExplorerComponent,
    PipFileUploaderComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-boy-3000-mk-v-maintenance-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVMaintenancePageComponent implements OnDestroy {
  public constructor(private scriptsService: ScriptsService) {
    this.scriptsService.loadScript('pip/webtools/uart.js');

    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for ' +
        'commercial purposes. Use of any materials is at your own risk.',
    );
  }

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
  }
}
