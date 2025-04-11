import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip/actions-quick-nav/pip-actions-quick-nav.component';
import { PipFileExplorerComponent } from 'src/app/components/pip/file-explorer/pip-file-explorer.component';

@Component({
  selector: 'pip-stats-page',
  templateUrl: './stats-page.component.html',
  imports: [
    CommonModule,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipFileExplorerComponent,
    PipLogComponent,
  ],
  styleUrl: './stats-page.component.scss',
  providers: [],
  standalone: true,
})
export class StatsPageComponent {}
