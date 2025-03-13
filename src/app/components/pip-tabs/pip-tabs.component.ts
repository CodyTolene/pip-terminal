import { PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { PipTabComponent } from './pip-tab.component';

@Component({
  selector: 'pip-tabs',
  templateUrl: './pip-tabs.component.html',
  styleUrls: ['./pip-tabs.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class PipTabsComponent {
  public constructor(private readonly pipTabsService: PipTabsService) {}

  @ContentChildren(PipTabComponent)
  protected tabs!: QueryList<PipTabComponent>;

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
      await this.pipTabsService.switchToTab(tab.label, 0, true);
    }
  }
}
