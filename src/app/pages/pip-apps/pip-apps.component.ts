import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipActionsAppsComponent } from 'src/app/components/pip-actions-apps/pip-actions-apps.component';
import { PipActionsMiscComponent } from 'src/app/components/pip-actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip-actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip-actions-quick-nav/pip-actions-quick-nav.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

@Component({
  selector: 'pip-apps',
  templateUrl: './pip-apps.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipActionsAppsComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-apps.component.scss',
  providers: [],
  standalone: true,
})
export class PipAppsComponent {}
