import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipActionsConnectionComponent } from 'src/app/components/pip-actions-connection/pip-actions-connection.component';
import { PipActionsDateTimeComponent } from 'src/app/components/pip-actions-date-time/pip-actions-date-time.component';
import { PipActionsFactoryTestComponent } from 'src/app/components/pip-actions-factory-test/pip-actions-factory-test.component';
import { PipActionsFirmwareComponent } from 'src/app/components/pip-actions-firmware/pip-actions-firmware.component';
import { PipActionsOwnerComponent } from 'src/app/components/pip-actions-owner/pip-actions-owner.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

@Component({
  selector: 'pip-maintenance',
  templateUrl: './pip-maintenance.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipActionsConnectionComponent,
    PipActionsDateTimeComponent,
    PipActionsFactoryTestComponent,
    PipActionsFirmwareComponent,
    PipActionsOwnerComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-maintenance.component.scss',
  providers: [],
  standalone: true,
})
export class PipMaintenanceComponent {}
