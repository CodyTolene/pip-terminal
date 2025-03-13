import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipSoundEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipSoundService } from 'src/app/services/pip-sound.service';
import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { PipTabComponent } from './pip-tab.component';

@UntilDestroy()
@Component({
  selector: 'pip-tabs',
  templateUrl: './pip-tabs.component.html',
  styleUrls: ['./pip-tabs.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class PipTabsComponent implements AfterContentInit {
  public constructor(
    private readonly pipSoundService: PipSoundService,
    private readonly pipTabsService: PipTabsService,
  ) {}

  @ContentChildren(PipTabComponent)
  protected tabs!: QueryList<PipTabComponent>;

  public async ngAfterContentInit(): Promise<void> {
    this.tabs.changes
      .pipe(untilDestroyed(this))
      .subscribe(async () => await this.syncTabs());
  }

  protected getActiveSubTabIndex(tab: PipTabComponent): number {
    return this.pipTabsService.getActiveSubTabIndex(tab.label);
  }

  protected getActiveTabLabel(): PipTabLabelEnum | null {
    return this.pipTabsService.activeTabLabel();
  }

  protected getActiveSubTabLabel(tab: PipTabComponent): string | null {
    return (
      this.pipTabsService.getActiveSubTabLabel(tab.label)?.toLowerCase() ?? null
    );
  }

  protected async selectTab(index: number): Promise<void> {
    const tab = this.tabs.get(index);
    if (tab) {
      await this.pipTabsService.switchToTab(tab.label, 0);
      await this.pipSoundService.playSound(PipSoundEnum.TICK_TAB, 100);
    }
  }

  private async syncTabs(): Promise<void> {
    if (this.tabs.length > 0 && !this.pipTabsService.activeTabLabel()) {
      await this.pipTabsService.switchToTab(this.tabs.first.label);
    }
  }
}
