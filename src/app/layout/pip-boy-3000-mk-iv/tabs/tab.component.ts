import {
  PipUrlsEnum,
  SoundEnum,
  SubTabLabelEnum,
  TabLabelEnum,
} from 'src/app/enums';

import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBoy3000TabsService } from 'src/app/services/pip-boy-3000-mk-iv/pip-boy-3000-tabs.service';
import { SoundService } from 'src/app/services/sound.service';

import { SubTabComponent } from './sub-tab.component';

@Component({
  selector: 'pip-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class TabComponent implements AfterContentInit {
  public constructor(
    private readonly tabsService: PipBoy3000TabsService,
    private readonly soundService: SoundService,
  ) {}

  @Input({ required: true }) public label!: TabLabelEnum;

  @ViewChild('content', { static: true })
  public content!: TemplateRef<unknown>;

  @ContentChildren(SubTabComponent)
  protected subTabs!: QueryList<SubTabComponent>;

  public ngAfterContentInit(): void {
    const subTabLabels = this.subTabs.map((subTab) => subTab.label);
    this.tabsService.setSubTabs(this.label, subTabLabels);

    if (
      subTabLabels.length > 0 &&
      this.tabsService.getActiveSubTabIndex(this.label) === 0
    ) {
      this.tabsService.setActiveSubTabIndex(this.label, 0);
    }
  }

  protected onSubTabClick(_subTab: SubTabComponent): void {
    this.soundService.playSound(SoundEnum.TICK_SUBTAB, 50);
  }

  protected getActiveSubTabIndex(label: TabLabelEnum): number {
    return this.tabsService.getActiveSubTabIndex(label);
  }

  protected getTabRouterLink(
    tabLabel: TabLabelEnum,
    subTabLabel: SubTabLabelEnum,
  ): string {
    const tabPath = `${PipUrlsEnum.PIP_3000_MK_IV}/${tabLabel.toLowerCase()}`;
    const subTabPath = subTabLabel.toLowerCase();
    return `${tabPath}/${subTabPath}`;
  }
}
