import { PipFileService } from 'services/pip-file.service';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logLink, logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-actions-firmware',
  templateUrl: './pip-actions-firmware.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatProgressBarModule,
    PipButtonComponent,
  ],
  styleUrl: './pip-actions-firmware.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsFirmwareComponent {
  public constructor(private readonly fileService: PipFileService) {}

  protected selectedFile: File | null = null;

  protected readonly signals = pipSignals;

  protected async fetchLatestUpdateLinks(): Promise<void> {
    logMessage('Fetching latest update links...');

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

      logLink('Latest Upgrade ZIP', upgradeLink);
      logLink('Latest Full Firmware ZIP', releaseLink);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      logMessage('Error fetching firmware links: ' + message);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] || null;
  }

  protected async startUpdate(): Promise<void> {
    if (this.selectedFile) {
      this.signals.isUploadingFile.set(true);
      await this.fileService.startUpdate(this.selectedFile);
      this.signals.isUploadingFile.set(false);
    } else {
      logMessage('No file selected.');
    }
  }
}
