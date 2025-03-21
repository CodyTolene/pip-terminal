import { PipFooterComponent } from 'src/app/layout/pip-footer/pip-footer.component';
import { PipRadioSetComponent } from 'src/app/pages/pip-radio-set/pip-radio-set.component';

import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipAnalyticsService } from 'src/app/services/pip-analytics.service';
import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSetDataService } from 'src/app/services/pip-set-data.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { PipTabLabelEnum } from './enums';
import { PipSubTabLabelEnum } from './enums/pip-sub-tab-label.enum';
import { PipSubTabComponent } from './layout/pip-tabs/pip-sub-tab.component';
import { PipTabComponent } from './layout/pip-tabs/pip-tab.component';
import { PipTabsComponent } from './layout/pip-tabs/pip-tabs.component';
import { PipApparelComponent } from './pages/pip-apparel/pip-apparel.component';
import { PipAttachmentsComponent } from './pages/pip-attachments/pip-attachments.component';
import { PipClockComponent } from './pages/pip-clock/pip-clock.component';
import { PipConnectComponent } from './pages/pip-connect/pip-connect.component';
import { PipDiagnosticsComponent } from './pages/pip-diagnostics/pip-diagnostics.component';
import { PipGamesComponent } from './pages/pip-games/pip-games.component';
import { PipMaintenanceComponent } from './pages/pip-maintenance/pip-maintenance.component';
import { PipMapComponent } from './pages/pip-map/pip-map.component';
import { PipRadioComponent } from './pages/pip-radio/pip-radio.component';
import { PipStatsComponent } from './pages/pip-stats/pip-stats.component';
import { PipStatusComponent } from './pages/pip-status/pip-status.component';
import { PipFileService } from './services/pip-file.service';
import { PipSoundService } from './services/pip-sound.service';
import { PipTabsService } from './services/pip-tabs.service';

@Component({
  selector: 'pip-root',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatLuxonDateModule,
    MatTooltipModule,
    PipGamesComponent,
    PipApparelComponent,
    PipAttachmentsComponent,
    PipClockComponent,
    PipConnectComponent,
    PipDiagnosticsComponent,
    PipFooterComponent,
    PipMaintenanceComponent,
    PipMapComponent,
    PipRadioComponent,
    PipRadioSetComponent,
    PipStatsComponent,
    PipStatusComponent,
    PipSubTabComponent,
    PipTabComponent,
    PipTabsComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [
    PipAnalyticsService,
    PipCommandService,
    PipConnectionService,
    PipDeviceService,
    PipFileService,
    PipGetDataService,
    PipSetDataService,
    PipSoundService,
    PipTabsService,
    PipTimeService,
  ],
})
export class PipComponent implements OnInit {
  public constructor(
    private readonly pipAnalyticsService: PipAnalyticsService,
    private readonly pipSoundService: PipSoundService,
    private readonly pipTabsService: PipTabsService,
  ) {
    this.soundVolume = this.pipSoundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  // private readonly swUpdate = inject(SwUpdate);
  // private readonly appRef = inject(ApplicationRef);

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;
  protected readonly soundVolume: WritableSignal<number>;

  public ngOnInit(): void {
    this.pipAnalyticsService.initialize();
    this.pipTabsService.initialize();
    // this.checkForUpdates();
  }

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }

  // private checkForUpdates(): void {
  //   if (!this.swUpdate.isEnabled) {
  //     console.warn('Service Worker is not enabled.');
  //     return;
  //   }

  //   // Check for updates every 5 minutes
  //   interval(5 * 60 * 1000).subscribe(async () => {
  //     try {
  //       const updateAvailable = await this.swUpdate.checkForUpdate();
  //       if (updateAvailable) {
  //         // eslint-disable-next-line no-console
  //         console.log('New update available. Applying now...');
  //         await this.swUpdate.activateUpdate();
  //         location.reload();
  //       }
  //     } catch (error) {
  //       console.error('Error checking for updates:', error);
  //     }
  //   });

  //   // Also listen for update notifications
  //   this.swUpdate.versionUpdates.subscribe(async (event) => {
  //     if (event.type === 'VERSION_READY') {
  //       // eslint-disable-next-line no-console
  //       console.log('New version detected. Reloading...');
  //       await this.swUpdate.activateUpdate();
  //       location.reload();
  //     }
  //   });
  // }
}
