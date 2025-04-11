import { FooterComponent } from 'src/app/layout/footer/footer.component';
import { RadioSetPageComponent } from 'src/app/pages/radio-set/radio-set-page.component';

import { CommonModule } from '@angular/common';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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

import { TabLabelEnum } from './enums';
import { SubTabLabelEnum } from './enums/sub-tab-label.enum';
import { SubTabComponent } from './layout/tabs/sub-tab.component';
import { TabComponent } from './layout/tabs/tab.component';
import { TabsComponent } from './layout/tabs/tabs.component';
import { ApparelPageComponent } from './pages/apparel/apparel-page.component';
import { AppsPageComponent } from './pages/apps/apps-page.component';
import { AttachmentsPageComponent } from './pages/attachments/attachments-page.component';
import { ClockPageComponent } from './pages/clock/clock-page.component';
import { ConnectPageComponent } from './pages/connect/connect-page.component';
import { DiagnosticsPageComponent } from './pages/diagnostics/diagnostics-page.component';
import { MaintenancePageComponent } from './pages/maintenance/maintenance-page.component';
import { MapPageComponent } from './pages/map/map-page.component';
import { RadioPageComponent } from './pages/radio/radio-page.component';
import { StatsPageComponent } from './pages/stats/stats-page.component';
import { StatusPageComponent } from './pages/status/status-page.component';
import { SoundService } from './services/sound.service';
import { TabsService } from './services/tabs.service';

@Component({
  selector: 'pip-root',
  templateUrl: './pip.component.html',
  imports: [
    ApparelPageComponent,
    AppsPageComponent,
    AttachmentsPageComponent,
    ClockPageComponent,
    CommonModule,
    ConnectPageComponent,
    DiagnosticsPageComponent,
    FooterComponent,
    MaintenancePageComponent,
    MapPageComponent,
    MatIconModule,
    MatLuxonDateModule,
    MatTooltipModule,
    RadioPageComponent,
    RadioSetPageComponent,
    StatsPageComponent,
    StatusPageComponent,
    SubTabComponent,
    TabComponent,
    TabsComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [
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
    private readonly soundService: SoundService,
    private readonly tabsService: TabsService,
  ) {
    this.soundVolume = this.soundService.globalVolumePercent;
    pipSignals.batteryLevel.set(100);
  }

  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly signals = pipSignals;
  protected readonly soundVolume: WritableSignal<number>;

  public async ngOnInit(): Promise<void> {
    this.tabsService.initialize();
  }

  protected async goToConnectTab(): Promise<void> {
    await this.tabsService.switchToTab(
      TabLabelEnum.STAT,
      SubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
