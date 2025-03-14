import { PipTabLabelEnum } from 'src/app/enums';

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

import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { PipSubTabComponent } from './pip-sub-tab.component';

@Component({
  selector: 'pip-tab',
  templateUrl: './pip-tab.component.html',
  styleUrls: ['./pip-tab.component.scss'],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class PipTabComponent implements AfterContentInit {
  public constructor(private readonly pipTabsService: PipTabsService) {}

  @Input({ required: true }) public label!: PipTabLabelEnum;

  @ViewChild('content', { static: true })
  public content!: TemplateRef<unknown>;

  @ContentChildren(PipSubTabComponent)
  protected subTabs!: QueryList<PipSubTabComponent>;

  public async ngAfterContentInit(): Promise<void> {
    const subTabLabels = this.subTabs.map((subTab) => subTab.label);
    this.pipTabsService.setSubTabs(this.label, subTabLabels);

    if (
      subTabLabels.length > 0 &&
      this.pipTabsService.getActiveSubTabIndex(this.label) === 0
    ) {
      await this.pipTabsService.setActiveSubTabIndex(this.label, 0);
    }
  }

  protected getActiveSubTabIndex(label: PipTabLabelEnum): number {
    return this.pipTabsService.getActiveSubTabIndex(label);
  }

  protected async selectSubTab(index: number): Promise<void> {
    await this.pipTabsService.setActiveSubTabIndex(this.label, index, true);
  }
}
