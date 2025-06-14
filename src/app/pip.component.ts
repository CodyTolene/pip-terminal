import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { ContentComponent } from 'src/app/layout/content/content.component';
import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { getEnumMember } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { PageMetaService } from 'src/app/services/page-meta.service';
import { PipAppsService } from 'src/app/services/pip/pip-apps.service';
import { PipCommandService } from 'src/app/services/pip/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip/pip-device.service';
import { PipFileService } from 'src/app/services/pip/pip-file.service';
import { PipGetDataService } from 'src/app/services/pip/pip-get-data.service';
import { PipSetDataService } from 'src/app/services/pip/pip-set-data.service';
import { PipSoundService } from 'src/app/services/pip/pip-sound.service';
import { PipTimeService } from 'src/app/services/pip/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { PipUrlsEnum, TabLabelEnum } from './enums';
import { SubTabLabelEnum } from './enums/sub-tab-label.enum';
import { SubTabComponent } from './layout/tabs/sub-tab.component';
import { TabComponent } from './layout/tabs/tab.component';
import { TabsComponent } from './layout/tabs/tabs.component';
import { SoundService } from './services/sound.service';
import { TabsService } from './services/tabs.service';

@UntilDestroy()
@Component({
  selector: 'pip-root',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    ContentComponent,
    FooterComponent,
    MatIconModule,
    MatLuxonDateModule,
    MatTooltipModule,
    SubTabComponent,
    TabComponent,
    TabsComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [
    PageMetaService,
    PipAppsService,
    PipCommandService,
    PipConnectionService,
    PipDeviceService,
    PipFileService,
    PipGetDataService,
    PipSetDataService,
    PipSoundService,
    PipTimeService,
    SoundService,
    TabsService,
  ],
})
export class PipComponent implements OnInit {
  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly pageMetaService: PageMetaService,
    private readonly router: Router,
    private readonly soundService: SoundService,
    private readonly tabsService: TabsService,
  ) {
    this.soundVolume = this.soundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  // Bind the services to the component.
  // https://github.com/angular/angularfire/blob/main/docs/analytics.md
  protected readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;

  protected readonly currentView: PipUrlsEnum = PipUrlsEnum.NONE;
  protected readonly signals = pipSignals;
  protected readonly soundVolume: WritableSignal<number>;

  public ngOnInit(): void {
    // Set the default tags for the page.
    this.pageMetaService.setTags();

    // Update the title when an active tab or sub-tab changes.
    this.tabsService.activeTabsChanges
      .pipe(untilDestroyed(this))
      .subscribe(({ activeTabLabel, activeSubTabLabel }) => {
        this.setPageTitle({ activeTabLabel, activeSubTabLabel });
      });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        let route = this.activatedRoute;
        const fullPathSegments: string[] = [];

        // Traverse the whole route tree and collect path segments
        while (route.firstChild) {
          route = route.firstChild;
          fullPathSegments.push(...route.snapshot.url.map((seg) => seg.path));
        }

        if (
          !fullPathSegments.includes(PipUrlsEnum.PIP_3000) ||
          !fullPathSegments.includes(PipUrlsEnum.PIP_3000)
        ) {
          // Is "Welcome" page
          return;
        }

        // Is a Pip-Boy page, set and render.
        const tabSegment = fullPathSegments[1]?.toUpperCase() || null;
        const subTabSegment = fullPathSegments[2]?.toUpperCase() || null;

        if (tabSegment) {
          const tab = getEnumMember(TabLabelEnum, tabSegment);
          if (tab && subTabSegment === null) {
            this.tabsService.switchToTab(PipUrlsEnum.PIP_3000, tab);
          } else if (tab && subTabSegment) {
            const subTab = getEnumMember(SubTabLabelEnum, subTabSegment);
            this.tabsService.switchToTab(PipUrlsEnum.PIP_3000, tab, subTab);
          }
        }
      });
  }

  protected setPageTitle(activeTabs: ActiveTabs): void {
    const { activeTabLabel, activeSubTabLabel } = activeTabs;
    const subtab = activeSubTabLabel ? ' > ' + activeSubTabLabel : '';
    this.pageMetaService.setTitle(`${activeTabLabel}${subtab}`);
  }
}
