import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { PageLayoutsEnum, SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipBoy3000MkIVFooterComponent } from 'src/app/layout/pip-boy-3000-mk-iv/footer/pip-boy-3000-mk-iv-footer.component';
import { SubTabComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/sub-tab.component';
import { TabComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/tab.component';
import { TabsComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/tabs.component';
import { pipSignals } from 'src/app/signals';
import { getEnumMember } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';

import { PageMetaService } from 'src/app/services/page-meta.service';
import { PipBoy3000TabsService } from 'src/app/services/pip-boy-3000-mk-iv/pip-boy-3000-tabs.service';
import { PipCommandService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-device.service';
import { PipFileService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-file.service';
import { PipGetDataService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-get-data.service';
import { PipSetDataService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-set-data.service';
import { PipSoundService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-sound.service';
import { PipTimeService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-time.service';
import { SoundService } from 'src/app/services/sound.service';

@UntilDestroy()
@Component({
  selector: 'pip-boy-3000-mk-iv-layout',
  templateUrl: './pip-boy-3000-mk-iv-layout.component.html',
  imports: [
    CommonModule,
    ContentComponent,
    PipBoy3000MkIVFooterComponent,
    MatIconModule,
    MatLuxonDateModule,
    MatTooltipModule,
    RouterModule,
    SubTabComponent,
    TabComponent,
    TabsComponent,
  ],
  styleUrl: './pip-boy-3000-mk-iv-layout.component.scss',
  providers: [
    PageMetaService,
    PipCommandService,
    PipConnectionService,
    PipDeviceService,
    PipFileService,
    PipGetDataService,
    PipSetDataService,
    PipSoundService,
    PipTimeService,
    SoundService,
    PipBoy3000TabsService,
  ],
})
export class PipBoy3000MkIVLayoutComponent implements OnInit, AfterViewInit {
  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly pageMetaService: PageMetaService,
    private readonly router: Router,
    private readonly soundService: SoundService,
    private readonly tabsService: PipBoy3000TabsService,
  ) {
    this.soundVolume = this.soundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;

  protected readonly currentView: PageLayoutsEnum = PageLayoutsEnum.NONE;
  protected readonly soundVolume: WritableSignal<number>;

  public ngOnInit(): void {
    // Update the title when an active tab or sub-tab changes.
    this.tabsService.activeTabsChanges
      .pipe(untilDestroyed(this))
      .subscribe(({ activeTabLabel, activeSubTabLabel }) => {
        this.setPageTitle({ activeTabLabel, activeSubTabLabel });
      });
  }

  public ngAfterViewInit(): void {
    this.processRoute();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        this.processRoute();
      });
  }

  protected setPageTitle(activeTabs: ActiveTabs): void {
    const { activeTabLabel, activeSubTabLabel } = activeTabs;
    const subtab = activeSubTabLabel ? ' > ' + activeSubTabLabel : '';
    this.pageMetaService.setTitle(`${activeTabLabel}${subtab}`);
  }

  private processRoute(): void {
    let route = this.activatedRoute;
    const fullPathSegments: string[] = [];

    while (route.firstChild) {
      route = route.firstChild;
      fullPathSegments.push(...route.snapshot.url.map((seg) => seg.path));
    }

    if (fullPathSegments.includes(PageLayoutsEnum.PIP_3000_MK_IV)) {
      // Matched PIP_3000_MK_IV route
      const tabSegment = fullPathSegments[1]?.toUpperCase() || null;
      const subTabSegment = fullPathSegments[2]?.toUpperCase() || null;

      const tab = getEnumMember(TabLabelEnum, tabSegment);
      const subTab = getEnumMember(SubTabLabelEnum, subTabSegment);

      if (tab && subTab) {
        // Switching to tab and subtab
        this.tabsService.switchToTab(
          PageLayoutsEnum.PIP_3000_MK_IV,
          tab,
          subTab,
        );
      } else if (tab) {
        // Switching to tab only
        this.tabsService.switchToTab(PageLayoutsEnum.PIP_3000_MK_IV, tab);
      } else {
        // Fallback to default tab/subtab
        this.tabsService.switchToTab(
          PageLayoutsEnum.PIP_3000_MK_IV,
          TabLabelEnum.STAT,
          SubTabLabelEnum.STATUS,
        );
      }
    }
  }
}
