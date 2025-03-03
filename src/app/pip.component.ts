import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
import { PipSubTabModule } from './components/pip-sub-tabs/pip-sub-tab.module';
import { PipTabModule } from './components/pip-tabs/pip-tab.module';

@Component({
  selector: 'pip-mod-terminal',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    PipAidComponent,
    PipApparelComponent,
    PipAttachmentsComponent,
    PipClockComponent,
    PipConnectComponent,
    PipDiagnosticsComponent,
    PipMaintenanceComponent,
    PipMapComponent,
    PipRadioComponent,
    PipStatsComponent,
    PipStatusComponent,
    PipSubTabModule,
    PipTabModule,
  ],
  styleUrl: './pip.component.scss',
  providers: [],
})
export class PipModTerminalComponent {
  protected signals = pipSignals;
}
