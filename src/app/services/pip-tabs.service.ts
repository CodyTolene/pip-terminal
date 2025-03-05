import {
  PipSoundEnum,
  PipSubTabLabelEnum,
  PipTabLabelEnum,
} from 'src/app/enums';

import { Injectable, signal } from '@angular/core';

import { PipSoundService } from 'src/app/services/pip-sound.service';

@Injectable({ providedIn: 'root' })
export class PipTabsService {
  public constructor(private readonly pipSoundService: PipSoundService) {}

  public activeTabLabel = signal<PipTabLabelEnum | null>(null);

  private activeSubTabIndexes = signal<Record<string, number>>({});
  private subTabLabels = new Map<PipTabLabelEnum, PipSubTabLabelEnum[]>();

  public setSubTabs(
    tabLabel: PipTabLabelEnum,
    subTabLabels: PipSubTabLabelEnum[],
  ): void {
    this.subTabLabels.set(tabLabel, subTabLabels);
  }

  public async switchToTab(
    tabLabel: PipTabLabelEnum,
    subTabOrIndex?: PipSubTabLabelEnum | number,
  ): Promise<void> {
    this.activeTabLabel.set(tabLabel);

    if (typeof subTabOrIndex === 'number') {
      this.setActiveSubTabIndex(tabLabel, subTabOrIndex);
    } else if (typeof subTabOrIndex === 'string') {
      const subTabIndex = this.getSubTabIndex(tabLabel, subTabOrIndex);
      if (subTabIndex === -1) {
        console.warn(
          `SubTab '${subTabOrIndex}' not found under tab '${tabLabel}'`,
        );
        this.setActiveSubTabIndex(tabLabel, 0);
      } else {
        this.setActiveSubTabIndex(tabLabel, subTabIndex);
      }
    } else {
      this.setActiveSubTabIndex(tabLabel, 0);
    }

    await this.pipSoundService.playSound(PipSoundEnum.TICK_TAB, 50);
    await this.pipSoundService.playSound(PipSoundEnum.TICK_SUBTAB, 25);
  }

  public setActiveSubTabIndex(
    tabLabel: PipTabLabelEnum,
    subTabIndex: number,
  ): void {
    const map = { ...this.activeSubTabIndexes() };
    map[tabLabel] = subTabIndex;
    this.activeSubTabIndexes.set(map);
  }

  public getActiveSubTabIndex(tabLabel: PipTabLabelEnum): number {
    return this.activeSubTabIndexes()[tabLabel] ?? 0;
  }

  private getSubTabIndex(
    tabLabel: PipTabLabelEnum,
    subTabLabel: PipSubTabLabelEnum,
  ): number {
    const subTabs = this.subTabLabels.get(tabLabel) ?? [];
    return subTabs.indexOf(subTabLabel);
  }
}
