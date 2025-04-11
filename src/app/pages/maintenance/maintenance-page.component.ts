import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';
import { PipActionsDateTimeComponent } from 'src/app/components/pip/actions-date-time/pip-actions-date-time.component';
import { PipActionsMiscComponent } from 'src/app/components/pip/actions-misc/pip-actions-misc.component';
import { PipActionsOwnerComponent } from 'src/app/components/pip/actions-owner/pip-actions-owner.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip/actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip/actions-quick-nav/pip-actions-quick-nav.component';
import { PipActionsTestingComponent } from 'src/app/components/pip/actions-testing/pip-actions-testing.component';
import { PipActionsUpdateComponent } from 'src/app/components/pip/actions-update/pip-actions-update.component';

@Component({
  selector: 'pip-maintenance',
  templateUrl: './maintenance-page.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipActionsDateTimeComponent,
    PipActionsUpdateComponent,
    PipActionsMiscComponent,
    PipActionsOwnerComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipActionsTestingComponent,
    PipLogComponent,
  ],
  styleUrl: './maintenance-page.component.scss',
  providers: [],
  standalone: true,
})
export class MaintenancePageComponent {}
