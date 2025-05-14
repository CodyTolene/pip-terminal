import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip/actions-quick-nav/pip-actions-quick-nav.component';
import { PipFileExplorerComponent } from 'src/app/components/pip/file-explorer/pip-file-explorer.component';
import { PipFileUploaderComponent } from 'src/app/components/pip/file-uploader/pip-file-uploader.component';

@Component({
  selector: 'pip-stats-page',
  templateUrl: './stats-page.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipFileExplorerComponent,
    PipFileUploaderComponent,
    PipLogComponent,
  ],
  styleUrl: './stats-page.component.scss',
  providers: [],
  standalone: true,
})
export class StatsPageComponent {}
