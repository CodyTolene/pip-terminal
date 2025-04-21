import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
} from 'rxjs';
import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { isNonEmptyValue } from 'src/app/utilities';

import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

/**
 * Service for managing tabs and sub-tabs in the application.
 */
@UntilDestroy()
@Injectable({ providedIn: 'root' })
export class TabsService {
  public constructor(private readonly router: Router) {}

  public activeTabLabel = signal<TabLabelEnum | null>(null);
  public activeSubTabLabel = signal<SubTabLabelEnum | null>(null);
  private activeSubTabIndexes = signal<Record<string, number>>({});

  private subTabLabels = new Map<TabLabelEnum, SubTabLabelEnum[]>();

  private lastEmittedTabLabel: string | null = null;
  private lastEmittedSubTabLabel: string | null = null;

  public readonly activeTabsChanges = combineLatest([
    toObservable(this.activeTabLabel).pipe(
      filter(isNonEmptyValue),
      distinctUntilChanged(),
    ),
    toObservable(this.activeSubTabLabel).pipe(distinctUntilChanged()),
  ]).pipe(
    filter(([activeTabLabel, activeSubTabLabel]) => {
      const tabChanged = activeTabLabel !== this.lastEmittedTabLabel;
      const subTabChanged = activeSubTabLabel !== this.lastEmittedSubTabLabel;

      const shouldEmit =
        (!tabChanged && subTabChanged) || (tabChanged && subTabChanged);
      if (shouldEmit) {
        this.lastEmittedTabLabel = activeTabLabel;
        this.lastEmittedSubTabLabel = activeSubTabLabel;
      }

      return shouldEmit;
    }),
    map(([activeTabLabel, activeSubTabLabel]) => ({
      activeTabLabel,
      activeSubTabLabel,
    })),
    shareReplay({ bufferSize: 1, refCount: true }),
    untilDestroyed(this),
  );

  /**
   * Switches to a specified tab and sub-tab in the application.
   *
   * @param tabLabel The label of the tab to switch to.
   * @param subTabOrIndex The label of the sub-tab to switch to, or the index of the
   * sub-tab. If not provided, the first sub-tab will be used.
   * @param playMainTabSound Whether to play the sound for switching tabs.
   */
  public async switchToTab(
    tabLabel: TabLabelEnum,
    subTabOrIndex?: SubTabLabelEnum | number | null,
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

    this.setActiveSubTabIndex(tabLabel, subTabIndex);

    const subTabLabel = this.getSubTabLabel(tabLabel, subTabIndex);
    this.activeSubTabLabel.set(subTabLabel);

    if (subTabLabel) {
      await this.router.navigate([
        tabLabel.toLowerCase(),
        subTabLabel.toLowerCase(),
      ]);
    } else {
      await this.router.navigate([tabLabel.toLowerCase()]);
    }
  }

  /**
   * Sets the active sub-tab index for a given tab label.
   *
   * @param tabLabel The label of the tab.
   * @param subTabIndex The index of the sub-tab to set as active.
   */
  public setActiveSubTabIndex(
    tabLabel: TabLabelEnum,
    subTabIndex: number,
  ): void {
    const map = { ...this.activeSubTabIndexes() };
    map[tabLabel] = subTabIndex;
    this.activeSubTabIndexes.set(map);
  }

  /**
   * Sets the sub-tab labels for a given tab label.
   *
   * @param tabLabel The label of the tab.
   * @param subTabLabels The array of sub-tab labels to set.
   */
  public setSubTabs(
    tabLabel: TabLabelEnum,
    subTabLabels: SubTabLabelEnum[],
  ): void {
    this.subTabLabels.set(tabLabel, subTabLabels);
  }

  /**
   * Gets the sub-tab labels for a given tab label.
   *
   * @param tabLabel The label of the tab.
   * @returns The array of sub-tab labels for the specified tab.
   */
  public getActiveSubTabIndex(tabLabel: TabLabelEnum): number {
    return this.activeSubTabIndexes()[tabLabel] ?? 0;
  }

  /**
   * Gets the active sub-tab label for a given tab label.
   *
   * @param tabLabel The label of the tab.
   * @returns The active sub-tab label for the specified tab, or null if not
   * found.
   */
  public getActiveSubTabLabel(tabLabel: TabLabelEnum): SubTabLabelEnum | null {
    const subTabs = this.subTabLabels.get(tabLabel) ?? [];
    const activeIndex = this.getActiveSubTabIndex(tabLabel);
    return subTabs[activeIndex] ?? subTabs[0] ?? null;
  }

  /**
   * Gets the index of a sub-tab label for a given tab label.
   *
   * @param tabLabel The label of the tab.
   * @param subTabLabel The label of the sub-tab.
   * @returns The index of the sub-tab label, or -1 if not found.
   */
  private getSubTabIndex(
    tabLabel: TabLabelEnum,
    subTabLabel: SubTabLabelEnum,
  ): number {
    const subTabs = this.subTabLabels.get(tabLabel) ?? [];
    return subTabs.indexOf(subTabLabel);
  }

  /**
   * Gets the sub-tab label for a given tab label and index.
   *
   * @param tabLabel The label of the tab.
   * @param index The index of the sub-tab.
   * @returns The sub-tab label, or null if not found.
   */
  private getSubTabLabel(
    tabLabel: TabLabelEnum,
    index: number,
  ): SubTabLabelEnum | null {
    return this.subTabLabels.get(tabLabel)?.[index] ?? null;
  }
}
