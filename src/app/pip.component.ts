import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipFooterComponent } from 'src/app/components/pip-footer/pip-footer.component';

import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSetDataService } from 'src/app/services/pip-set-data.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { PipAidComponent } from './components/pip-aid/pip-aid.component';
import { PipApparelComponent } from './components/pip-apparel/pip-apparel.component';
import { PipAttachmentsComponent } from './components/pip-attachments/pip-attachments.component';
import { PipClockComponent } from './components/pip-clock/pip-clock.component';
import { PipConnectComponent } from './components/pip-connect/pip-connect.component';
import { PipDiagnosticsComponent } from './components/pip-diagnostics/pip-diagnostics.component';
import { PipMaintenanceComponent } from './components/pip-maintenance/pip-maintenance.component';
import { PipMapComponent } from './components/pip-map/pip-map.component';
import { PipRadioComponent } from './components/pip-radio/pip-radio.component';
import { PipStatsComponent } from './components/pip-stats/pip-stats.component';
import { PipStatusComponent } from './components/pip-status/pip-status.component';
import { PipSubTabComponent } from './components/pip-tabs/pip-sub-tab.component';
import { PipTabComponent } from './components/pip-tabs/pip-tab.component';
import { PipTabsComponent } from './components/pip-tabs/pip-tabs.component';
import { PipTabLabelEnum } from './enums';
import { PipSubTabLabelEnum } from './enums/pip-sub-tab-label.enum';
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
    PipAidComponent,
    PipApparelComponent,
    PipAttachmentsComponent,
    PipClockComponent,
    PipConnectComponent,
    PipDiagnosticsComponent,
    PipFooterComponent,
    PipMaintenanceComponent,
    PipMapComponent,
    PipRadioComponent,
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
  }

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;
  protected readonly soundVolume: WritableSignal<number>;

  public ngOnInit(): void {
    this.pipTabsService.initialize();

    // Todo: Make this dynamic
    pipSignals.batteryLevel.set(100);
  }

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
