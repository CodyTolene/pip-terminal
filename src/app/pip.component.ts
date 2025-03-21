import { PipFooterComponent } from 'src/app/layout/pip-footer/pip-footer.component';
import { PipRadioSetComponent } from 'src/app/pages/pip-radio-set/pip-radio-set.component';

import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { PipAppsComponent } from './pages/pip-apps/pip-apps.component';
import { PipAttachmentsComponent } from './pages/pip-attachments/pip-attachments.component';
import { PipClockComponent } from './pages/pip-clock/pip-clock.component';
import { PipConnectComponent } from './pages/pip-connect/pip-connect.component';
import { PipDiagnosticsComponent } from './pages/pip-diagnostics/pip-diagnostics.component';
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
    PipAppsComponent,
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
    private readonly pipSoundService: PipSoundService,
    private readonly pipTabsService: PipTabsService,
  ) {
    this.soundVolume = this.pipSoundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;
  protected readonly soundVolume: WritableSignal<number>;

  public async ngOnInit(): Promise<void> {
    this.pipTabsService.initialize();
  }

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
