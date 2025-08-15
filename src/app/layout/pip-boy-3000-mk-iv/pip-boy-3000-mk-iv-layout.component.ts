import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { PageLayoutsEnum, SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipBoy3000MkIVFooterComponent } from 'src/app/layout/pip-boy-3000-mk-iv/footer/pip-boy-3000-mk-iv-footer.component';
import { SubTabComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/sub-tab.component';
import { TabComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/tab.component';
import { TabsComponent } from 'src/app/layout/pip-boy-3000-mk-iv/tabs/tabs.component';
import {
  PageMetaService,
  PipBoy3000TabsService,
  PipCommandService,
  PipConnectionService,
  PipDeviceService,
  PipFileService,
  PipGetDataService,
  PipSetDataService,
  PipSoundService,
  PipTimeService,
  SoundService,
} from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { getEnumMember } from 'src/app/utilities';

import {
  AfterViewInit,
  Component,
  OnInit,
  WritableSignal,
  inject,
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

@UntilDestroy()
@Component({
  selector: 'pip-boy-3000-mk-iv-layout',
  templateUrl: './pip-boy-3000-mk-iv-layout.component.html',
  imports: [
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
  standalone: true,
})
export class PipBoy3000MkIVLayoutComponent implements OnInit, AfterViewInit {
  public constructor() {
    this.soundVolume = this.soundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  private readonly soundService = inject(SoundService);

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pageMetaService = inject(PageMetaService);
  private readonly router = inject(Router);
  private readonly tabsService = inject(PipBoy3000TabsService);

  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;
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
