import { PipConnectionService } from 'services/pip-connection.service';
import { PipDeviceService } from 'services/pip-device.service';
import { PipFileService } from 'services/pip-file.service';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSetDataService } from 'src/app/services/pip-set-data.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { clearLog, logLink, logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-connect',
  templateUrl: './pip-connect.component.html',
  imports: [CommonModule, FormsModule, MatIconModule],
  styleUrl: './pip-connect.component.scss',
  providers: [
    PipCommandService,
    PipConnectionService,
    PipDeviceService,
    PipFileService,
    PipGetDataService,
    PipSetDataService,
  ],
  standalone: true,
})
export class PipConnectComponent implements OnInit {
  public constructor(
    private connectionService: PipConnectionService,
    private deviceService: PipDeviceService,
    private fileService: PipFileService,
    private setDataService: PipSetDataService,
  ) {}

  protected ownerName: string | null = null;
  protected selectedFile: File | null = null;
  protected signals = pipSignals;

  public ngOnInit(): void {
    logMessage('✅ Initialized Pip Terminal');
    logMessage('✅ Ready to connect');
  }

  protected async connect(): Promise<void> {
    await this.connectionService.connect();
    await this.deviceService.initialize();
  }

  protected clearLog(): void {
    clearLog();
  }

  protected async disconnect(): Promise<void> {
    await this.connectionService.disconnect();
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

  protected logTermsOfUse(): void {
    logMessage(
      '⚖️ Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for commercial ' +
        'purposes. Use of any materials is at your own risk.',
    );
    logLink(
      '🔗 More info',
      'https://github.com/CodyTolene/pip-boy-mod-terminal/blob/main/TERMS.md',
    );
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  protected async resetOwnerName(): Promise<void> {
    await this.setDataService.resetOwnerName();
  }

  protected async restart(): Promise<void> {
    await this.deviceService.restart();
  }

  protected async setOwnerName(name: string | null): Promise<void> {
    await this.setDataService.setOwnerName(name);
  }

  protected async shutdown(): Promise<void> {
    await this.deviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.deviceService.sleep();
  }

  protected async startUpgrade(): Promise<void> {
    if (this.selectedFile) {
      await this.fileService.startUpgrade(this.selectedFile);
    } else {
      logMessage('⚠️ No file selected.');
    }
  }

  protected async wake(): Promise<void> {
    await this.deviceService.wake();
  }
}
