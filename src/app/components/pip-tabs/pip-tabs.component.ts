import { PipSoundEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { PipSoundService } from 'src/app/services/pip-sound.service';
import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { PipTabComponent } from './pip-tab.component';

@Component({
  selector: 'pip-tabs',
  templateUrl: './pip-tabs.component.html',
  styleUrls: ['./pip-tabs.component.scss'],
  imports: [CommonModule],
  providers: [],
})
export class PipTabsComponent implements AfterContentInit {
  public constructor(
    private readonly pipSoundService: PipSoundService,
    private readonly pipTabsService: PipTabsService,
  ) {}

  @ContentChildren(PipTabComponent)
  protected tabs!: QueryList<PipTabComponent>;

  public ngAfterContentInit(): void {
    this.tabs.changes.subscribe(() => this.syncTabs());
    this.syncTabs();
  }

  protected getActiveTabLabel(): PipTabLabelEnum | null {
    return this.pipTabsService.activeTabLabel();
  }

  protected async selectTab(index: number): Promise<void> {
    const tab = this.tabs.get(index);
    if (tab) {
      this.pipTabsService.switchToTab(tab.label);
      await this.playTabSelectSound();
    }
  }

  private async playTabSelectSound(): Promise<void> {
    await this.pipSoundService.playSound(PipSoundEnum.TICK_TAB, 50);
  }

  private syncTabs(): void {
    if (this.tabs.length > 0 && !this.pipTabsService.activeTabLabel()) {
      this.pipTabsService.switchToTab(this.tabs.first.label);
    }
  }
}
