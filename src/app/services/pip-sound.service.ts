import { PipSoundEnum } from 'src/app/enums';

import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PipSoundService {
  public constructor() {
    this.preloadSounds();
  }

  // Global volume (0-100%)
  public globalVolumePercent = signal(100);

  private readonly sounds = new Map<PipSoundEnum, HTMLAudioElement>();

  public async playSound(
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

  public setGlobalVolume(percent: number): void {
    this.globalVolumePercent.set(Math.max(0, Math.min(100, percent)));
  }

  private preloadSounds(): void {
    this.registerSound(PipSoundEnum.TICK_TAB, 'sounds/tick.wav');
    this.registerSound(PipSoundEnum.TICK_SUBTAB, 'sounds/tick-2.wav');
  }

  private registerSound(name: PipSoundEnum, path: string): void {
    const audio = new Audio(path);
    audio.load(); // Preload
    this.sounds.set(name, audio);
  }
}
