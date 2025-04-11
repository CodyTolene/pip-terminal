import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsAppsComponent } from 'src/app/components/pip/actions-apps/pip-actions-apps.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip/actions-quick-nav/pip-actions-quick-nav.component';

@Component({
  selector: 'pip-apps-page',
  templateUrl: './apps-page.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipActionsAppsComponent,
    PipLogComponent,
  ],
  styleUrl: './apps-page.component.scss',
  providers: [],
  standalone: true,
})
export class AppsPageComponent {}
