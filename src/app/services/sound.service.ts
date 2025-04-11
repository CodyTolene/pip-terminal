import { SoundEnum } from 'src/app/enums';

import { Injectable, signal } from '@angular/core';

/** Service for managing sounds on the website. */
@Injectable({ providedIn: 'root' })
export class SoundService {
  public constructor() {
    this.preloadSounds();
  }

  /** Global _website_ volume (0-100%) */
  public globalVolumePercent = signal(100);

  private readonly sounds = new Map<SoundEnum, HTMLAudioElement>();

  /**
   * Plays a sound on the website.
   *
   * @param name The name of the sound to play.
   * @param volumePercent The volume percentage (0-100%).
   */
  public async playSound(name: SoundEnum, volumePercent = 100): Promise<void> {
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

  /**
   * Sets the global website volume.
   *
   * @param percent The volume percentage (0-100%).
   */
  public setGlobalVolume(percent: number): void {
    this.globalVolumePercent.set(Math.max(0, Math.min(100, percent)));
  }

  /** Preloads website sounds. */
  private preloadSounds(): void {
    this.registerSound(SoundEnum.TICK_TAB, 'sounds/tick.wav');
    this.registerSound(SoundEnum.TICK_SUBTAB, 'sounds/tick-2.wav');
  }

  /**
   * Registers a sound for the website.
   *
   * @param name The name of the sound.
   * @param path The path to the sound file.
   */
  private registerSound(name: SoundEnum, path: string): void {
    const audio = new Audio(path);
    audio.load(); // Preload
    this.sounds.set(name, audio);
  }
}
