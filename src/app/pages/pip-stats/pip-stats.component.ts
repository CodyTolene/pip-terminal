import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipActionsPrimaryComponent } from 'src/app/components/pip-actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip-actions-quick-nav/pip-actions-quick-nav.component';
import { PipFileExplorerComponent } from 'src/app/components/pip-file-explorer/pip-file-explorer.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

@Component({
  selector: 'pip-stats',
  templateUrl: './pip-stats.component.html',
  imports: [
    CommonModule,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipFileExplorerComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-stats.component.scss',
  providers: [],
  standalone: true,
})
export class PipStatsComponent {}
