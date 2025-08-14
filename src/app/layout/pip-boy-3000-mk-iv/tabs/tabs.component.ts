import { PageLayoutsEnum, SoundEnum, TabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBoy3000TabsService } from 'src/app/services/pip-boy-3000-mk-iv/pip-boy-3000-tabs.service';
import { SoundService } from 'src/app/services/sound.service';

import { TabComponent } from './tab.component';

@Component({
  selector: 'pip-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class TabsComponent {
  public constructor(
    private readonly tabsService: PipBoy3000TabsService,
    private readonly soundService: SoundService,
  ) {}

  @ContentChildren(TabComponent)
  protected tabs!: QueryList<TabComponent>;

  protected getActiveSubTabIndex(tab: TabComponent): number {
    return this.tabsService.getActiveSubTabIndex(tab.label);
  }

  protected getActiveTabLabel(): TabLabelEnum | null {
    return this.tabsService.activeTabLabel();
  }

  protected getActiveSubTabLabel(tab: TabComponent): string | null {
    return (
      this.tabsService.getActiveSubTabLabel(tab.label)?.toLowerCase() ?? null
    );
  }

  protected onTabClick(_tab: TabComponent): void {
    this.soundService.playSound(SoundEnum.TICK_TAB, 100);
  }

  protected getTabRouterLink(tab: TabComponent): string[] {
    const tabPath = `${PageLayoutsEnum.PIP_3000_MK_IV}/${tab.label.toLowerCase()}`;
    const subTab = this.getActiveSubTabLabel(tab);

    return subTab ? [tabPath, subTab.toLowerCase()] : [tabPath];
  }
}
