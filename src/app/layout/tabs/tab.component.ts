import { TabLabelEnum } from 'src/app/enums';

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

import { TabsService } from 'src/app/services/tabs.service';

import { SubTabComponent } from './sub-tab.component';

@Component({
  selector: 'pip-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class TabComponent implements AfterContentInit {
  public constructor(private readonly tabsService: TabsService) {}

  @Input({ required: true }) public label!: TabLabelEnum;

  @ViewChild('content', { static: true })
  public content!: TemplateRef<unknown>;

  @ContentChildren(SubTabComponent)
  protected subTabs!: QueryList<SubTabComponent>;

  public async ngAfterContentInit(): Promise<void> {
    const subTabLabels = this.subTabs.map((subTab) => subTab.label);
    this.tabsService.setSubTabs(this.label, subTabLabels);

    if (
      subTabLabels.length > 0 &&
      this.tabsService.getActiveSubTabIndex(this.label) === 0
    ) {
      await this.tabsService.setActiveSubTabIndex(this.label, 0);
    }
  }

  protected getActiveSubTabIndex(label: TabLabelEnum): number {
    return this.tabsService.getActiveSubTabIndex(label);
  }
}
