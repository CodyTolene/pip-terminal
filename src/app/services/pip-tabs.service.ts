import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import {
  PipSoundEnum,
  PipSubTabLabelEnum,
  PipTabLabelEnum,
} from 'src/app/enums';
import { getEnumMember, isNonEmptyString } from 'src/app/utilities';

import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { PipSoundService } from 'src/app/services/pip-sound.service';

@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class PipTabsService {
  public constructor(
    private readonly pipSoundService: PipSoundService,
    private readonly router: Router,
  ) {}

  public activeTabLabel = signal<PipTabLabelEnum | null>(null);
  private activeSubTabIndexes = signal<Record<string, number>>({});

  private subTabLabels = new Map<PipTabLabelEnum, PipSubTabLabelEnum[]>();
  private isInitialized = false;

  public initialize(): void {
    if (this.isInitialized) {
      console.warn('PipTabsService already initialized!');
      return;
    }

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(async ({ url }: NavigationEnd) => {
        const urlPieces = url.split('/').slice(1);

        const goToDefaultTab = async (): Promise<void> => {
          await this.switchToTab(
            PipTabLabelEnum.STAT,
            PipSubTabLabelEnum.STATUS,
          );
        };

        if (!isNonEmptyString(urlPieces[0])) {
          goToDefaultTab();
          return;
        }

        const tabLabel = urlPieces[0].toUpperCase();
        const subTabLabel =
          isNonEmptyString(urlPieces[1]) && urlPieces[1] !== 'null'
            ? urlPieces[1].toUpperCase()
            : null;

        const tab = getEnumMember(PipTabLabelEnum, tabLabel);
        const subTab = subTabLabel
          ? getEnumMember(PipSubTabLabelEnum, subTabLabel)
          : null;

        if (!tab) {
          goToDefaultTab();
          return;
        }

        await this.switchToTab(tab, subTab);
      });
  }

  public async switchToTab(
    tabLabel: PipTabLabelEnum,
    subTabOrIndex?: PipSubTabLabelEnum | number | null,
    { playMainTabSound, playSubTabSound }: SwitchTabOptions = {},
  ): Promise<void> {
    this.activeTabLabel.set(tabLabel);

    let subTabIndex = 0;
    if (typeof subTabOrIndex === 'number') {
      subTabIndex = subTabOrIndex;
    } else if (typeof subTabOrIndex === 'string') {
      subTabIndex = this.getSubTabIndex(tabLabel, subTabOrIndex);
      if (subTabIndex === -1) {
        console.warn(
          `SubTab '${subTabOrIndex}' not found under tab '${tabLabel}'`,
        );
        subTabIndex = 0;
      }
    }

    if (playMainTabSound) {
      await this.pipSoundService.playWebsiteSound(PipSoundEnum.TICK_TAB, 100);
    }

    await this.setActiveSubTabIndex(tabLabel, subTabIndex, playSubTabSound);

    const subTabLabel = this.getSubTabLabel(tabLabel, subTabIndex);
    if (subTabLabel) {
      this.router.navigate([tabLabel.toLowerCase(), subTabLabel.toLowerCase()]);
    } else {
      this.router.navigate([tabLabel.toLowerCase()]);
    }
  }

  public async setActiveSubTabIndex(
    tabLabel: PipTabLabelEnum,
    subTabIndex: number,
    playSubTabSound = false,
  ): Promise<void> {
    const map = { ...this.activeSubTabIndexes() };
    map[tabLabel] = subTabIndex;
    this.activeSubTabIndexes.set(map);
    if (playSubTabSound) {
      await this.pipSoundService.playWebsiteSound(PipSoundEnum.TICK_SUBTAB, 50);
    }
  }

  public setSubTabs(
    tabLabel: PipTabLabelEnum,
    subTabLabels: PipSubTabLabelEnum[],
  ): void {
    this.subTabLabels.set(tabLabel, subTabLabels);
  }

  public getActiveSubTabIndex(tabLabel: PipTabLabelEnum): number {
    return this.activeSubTabIndexes()[tabLabel] ?? 0;
  }

  public getActiveSubTabLabel(
    tabLabel: PipTabLabelEnum,
  ): PipSubTabLabelEnum | null {
    const subTabs = this.subTabLabels.get(tabLabel) ?? [];
    const activeIndex = this.getActiveSubTabIndex(tabLabel);
    return subTabs[activeIndex] ?? subTabs[0] ?? null;
  }

  private getSubTabIndex(
    tabLabel: PipTabLabelEnum,
    subTabLabel: PipSubTabLabelEnum,
  ): number {
    const subTabs = this.subTabLabels.get(tabLabel) ?? [];
    return subTabs.indexOf(subTabLabel);
  }

  private getSubTabLabel(
    tabLabel: PipTabLabelEnum,
    index: number,
  ): PipSubTabLabelEnum | null {
    return this.subTabLabels.get(tabLabel)?.[index] ?? null;
  }
}

interface SwitchTabOptions {
  playMainTabSound?: boolean;
  playSubTabSound?: boolean;
}
