import { PipFileService } from 'services/pip-file.service';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, EffectRef, OnDestroy, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipSetDataService } from 'src/app/services/pip-set-data.service';
import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logLink, logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-maintenance',
  templateUrl: './pip-maintenance.component.html',
  imports: [CommonModule, FormsModule, MatIconModule, PipLogComponent],
  styleUrl: './pip-maintenance.component.scss',
  providers: [],
  standalone: true,
})
export class PipMaintenanceComponent implements OnDestroy {
  public constructor(
    private readonly connectionService: PipConnectionService,
    private readonly deviceService: PipDeviceService,
    private readonly fileService: PipFileService,
    private readonly setDataService: PipSetDataService,
    private readonly pipTabsService: PipTabsService,
  ) {
    this.ownerNameEffect = effect(() => {
      const name = this.signals.ownerName();
      this.ownerName = name === '' || name === '<NONE>' ? null : name;
    });
  }

  protected ownerName: string | null = null;
  protected selectedFile: File | null = null;

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;

  private readonly ownerNameEffect: EffectRef;

  public ngOnDestroy(): void {
    this.ownerNameEffect.destroy();
  }

  protected async fetchLatestUpdateLinks(): Promise<void> {
    logMessage('📡 Fetching latest update links...');

    const upgradeUrl =
      'https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=upgrade.zip';
    const releaseUrl =
      'https://thewandcompany.com/pip-boy/upgrade/readlink.php?link=release.zip';

    try {
      const upgradeResponse = await fetch(upgradeUrl);
      const upgradeFileName = await upgradeResponse.text();
      const upgradeLink = `https://thewandcompany.com/pip-boy/upgrade/${upgradeFileName.trim()}`;

      const releaseResponse = await fetch(releaseUrl);
      const releaseFileName = await releaseResponse.text();
      const releaseLink = `https://thewandcompany.com/pip-boy/upgrade/${releaseFileName.trim()}`;

      logLink('🔗 Latest Upgrade ZIP', upgradeLink);
      logLink('🔗 Latest Full Firmware ZIP', releaseLink);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logMessage('❌ Error fetching firmware links: ' + message);
    }
  }

  protected async connect(): Promise<void> {
    await this.connectionService.connect();
    await this.deviceService.initialize();
  }

  protected async disconnect(): Promise<void> {
    await this.connectionService.disconnect();
  }

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
    );
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  protected async resetOwnerName(): Promise<void> {
    await this.setDataService.resetOwnerName();
  }

  protected async setOwnerName(name: string | null): Promise<void> {
    await this.setDataService.setOwnerName(name);
  }

  protected async startUpdate(): Promise<void> {
    if (this.selectedFile) {
      await this.fileService.startUpdate(this.selectedFile);
    } else {
      logMessage('⚠️ No file selected.');
    }
  }
}
