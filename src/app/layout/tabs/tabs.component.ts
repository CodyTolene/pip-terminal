import { TabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsService } from 'src/app/services/tabs.service';

import { TabComponent } from './tab.component';

@Component({
  selector: 'pip-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class TabsComponent {
  public constructor(private readonly tabsService: TabsService) {}

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

  protected getTabRouterLink(tab: TabComponent): string[] {
    const tabPath = tab.label.toLowerCase();
    const subTab = this.getActiveSubTabLabel(tab);

    return subTab ? [tabPath, subTab.toLowerCase()] : [tabPath];
  }
}
