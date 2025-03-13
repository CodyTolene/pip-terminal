import { PipConnectionService } from 'services/pip-connection.service';
import { PipDeviceService } from 'services/pip-device.service';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-connect',
  templateUrl: './pip-connect.component.html',
  imports: [CommonModule, FormsModule, MatIconModule, PipLogComponent],
  styleUrl: './pip-connect.component.scss',
  standalone: true,
})
export class PipConnectComponent implements OnInit {
  public constructor(
    private readonly connectionService: PipConnectionService,
    private readonly deviceService: PipDeviceService,
    private readonly pipTabsService: PipTabsService,
  ) {}

  protected ownerName: string | null = null;
  protected selectedFile: File | null = null;

  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly signals = pipSignals;

  public ngOnInit(): void {
    logMessage('Initialized Pip Terminal');
    logMessage('Ready to connect');
    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for commercial ' +
        'purposes. Use of any materials is at your own risk.',
    );
  }

  protected async connect(): Promise<void> {
    await this.connectionService.connect();
    await this.deviceService.initialize();
  }

  protected async disconnect(): Promise<void> {
    await this.connectionService.disconnect();
  }

  protected async goToMaintenanceTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.DATA,
      PipSubTabLabelEnum.MAINTENANCE,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }

  protected async restart(): Promise<void> {
    await this.deviceService.restart();
  }

  protected async shutdown(): Promise<void> {
    await this.deviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.deviceService.sleep();
  }

  protected async wake(): Promise<void> {
    await this.deviceService.wake();
  }
}
