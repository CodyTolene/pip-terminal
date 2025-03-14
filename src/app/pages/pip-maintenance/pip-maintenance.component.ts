import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipActionsConnectionComponent } from 'src/app/components/pip-actions-connection/pip-actions-connection.component';
import { PipActionsDateTimeComponent } from 'src/app/components/pip-actions-date-time/pip-actions-date-time.component';
import { PipActionsFirmwareComponent } from 'src/app/components/pip-actions-firmware/pip-actions-firmware.component';
import { PipActionsOwnerComponent } from 'src/app/components/pip-actions-owner/pip-actions-owner.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

@Component({
  selector: 'pip-maintenance',
  templateUrl: './pip-maintenance.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipActionsConnectionComponent,
    PipActionsDateTimeComponent,
    PipActionsFirmwareComponent,
    PipActionsOwnerComponent,
    PipButtonComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-maintenance.component.scss',
  providers: [],
  standalone: true,
})
export class PipMaintenanceComponent {
  public constructor(private readonly pipTabsService: PipTabsService) {}

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
