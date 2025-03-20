import {
  DxRadioFileNameEnum,
  MxRadioFileNameEnum,
  PipSoundEnum,
} from 'src/app/enums';
import { logMessage, wait } from 'src/app/utilities';

import { Injectable, signal } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipFileService } from 'src/app/services/pip-file.service';

import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipSoundService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {
    this.preloadWebsiteSounds();
  }

  // Global volume (0-100%)
  public globalVolumePercent = signal(100);

  private readonly sounds = new Map<PipSoundEnum, HTMLAudioElement>();

  public async playRadioFileOnDevice(
    radioFileName: DxRadioFileNameEnum | MxRadioFileNameEnum,
  ): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first before clearing screen.');
      return false;
    }

    try {
      await this.stopAllSoundsOnDevice();

      const result = await this.pipCommandService.cmd<boolean>(`
        (() => {
          try {
            Pip.audioStart("RADIO/${radioFileName}.wav");
            return true;
          } catch {
            return false;
          }
        })();
      `);

      return result ?? false;
    } catch {
      logMessage(`Failed to play radio file "${radioFileName}".`);
      return false;
    }
  }

  public async playWebsiteSound(
    name: PipSoundEnum,
    volumePercent = 100,
  ): Promise<void> {
    const sound = this.sounds.get(name);

    if (!sound) {
      console.warn(`Sound "${name}" not found.`);
      return;
    }

    sound.currentTime = 0;

    // Apply global volume multiplier
    const adjustedVolume =
      (volumePercent / 100) * (this.globalVolumePercent() / 100);

    // Clamp volume to [0.0, 1.0]
    sound.volume = Math.max(0, Math.min(1, adjustedVolume));

    try {
      await sound.play();
    } catch (error) {
      console.warn(`Failed to play sound "${name}":`, error);
    }
  }

  public setGlobalWebsiteVolume(percent: number): void {
    this.globalVolumePercent.set(Math.max(0, Math.min(100, percent)));
  }

  public async stopAllSoundsOnDevice(): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first before clearing screen.');
      return false;
    }

    try {
      const result = await this.pipCommandService.cmd<boolean>(`
        (() => {
          try {
            // Stop any existing audio
            if (Pip.audioStop) {
              Pip.audioStop();
            }

            // Stop the radio if it's playing
            if (Pip.radioOn) {
              rd.enable(false);
              Pip.radioOn = false;
            }

            return true;
          } catch {
            return false;
          }
        })();
      `);

      return result ?? false;
    } catch {
      logMessage('Failed to stop all sounds.');
      return false;
    }
  }

  public async uploadRadioWavFile(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    if (!file.type.includes('audio/wav')) {
      logMessage('Invalid file type. Please select a .wav file.');
      return;
    }

    const filePath = `/RADIO/${file.name}`;

    const fileData = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileData);

    await this.pipDeviceService.clearScreen(`Uploading ${filePath}`);

    await this.pipFileService.uploadFileToPip(filePath, uint8Array, onProgress);

    // Wait for 1 second to allow the device to process the file
    await wait(1000);

    await this.pipDeviceService.clearScreen(
      'Completed! Continue uploading',
      'or restart to apply changes.',
      { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
    );
  }

  private preloadWebsiteSounds(): void {
    this.registerWebsiteSound(PipSoundEnum.TICK_TAB, 'sounds/tick.wav');
    this.registerWebsiteSound(PipSoundEnum.TICK_SUBTAB, 'sounds/tick-2.wav');
  }

  private registerWebsiteSound(name: PipSoundEnum, path: string): void {
    const audio = new Audio(path);
    audio.load(); // Preload
    this.sounds.set(name, audio);
  }
}
