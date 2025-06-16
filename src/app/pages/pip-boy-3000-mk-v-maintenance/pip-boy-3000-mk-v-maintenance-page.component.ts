import { PIP_SCRIPTS } from 'src/app/constants';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipFileExplorerComponent } from 'src/app/components/pip/file-explorer/pip-file-explorer.component';
import { PipFileUploaderComponent } from 'src/app/components/pip/file-uploader/pip-file-uploader.component';

import { ScriptKey } from 'src/app/constants/pip-scripts';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-maintenance-page',
  templateUrl: './pip-boy-3000-mk-v-maintenance-page.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipFileExplorerComponent,
    PipFileUploaderComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-boy-3000-mk-v-maintenance-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVMaintenancePageComponent implements OnDestroy {
  public constructor(private scriptsService: ScriptsService) {
    const scriptKey: ScriptKey = 'uart';
    this.scriptsService.loadScript(PIP_SCRIPTS[scriptKey]);
  }

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
  }
}
