import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipActionsConnectionComponent } from 'src/app/components/pip-actions-connection/pip-actions-connection.component';
import { PipActionsCustomizeRadioLinkComponent } from 'src/app/components/pip-actions-customize-radio-link/pip-actions-customize-radio-link.component';
import { PipActionsDateTimeComponent } from 'src/app/components/pip-actions-date-time/pip-actions-date-time.component';
import { PipActionsFirmwareComponent } from 'src/app/components/pip-actions-firmware/pip-actions-firmware.component';
import { PipActionsOwnerComponent } from 'src/app/components/pip-actions-owner/pip-actions-owner.component';
import { PipActionsTestingComponent } from 'src/app/components/pip-actions-testing/pip-actions-testing.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

@Component({
  selector: 'pip-maintenance',
  templateUrl: './pip-maintenance.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipActionsConnectionComponent,
    PipActionsCustomizeRadioLinkComponent,
    PipActionsDateTimeComponent,
    PipActionsFirmwareComponent,
    PipActionsOwnerComponent,
    PipActionsTestingComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-maintenance.component.scss',
  providers: [],
  standalone: true,
})
export class PipMaintenanceComponent {}
