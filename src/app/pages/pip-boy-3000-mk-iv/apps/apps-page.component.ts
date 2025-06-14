import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsAppsComponent } from 'src/app/components/pip/actions-apps/pip-actions-apps.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';

@Component({
  selector: 'pip-apps-page',
  templateUrl: './apps-page.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipActionsAppsComponent,
    PipLogComponent,
  ],
  styleUrl: './apps-page.component.scss',
  providers: [],
  standalone: true,
})
export class AppsPageComponent {}
