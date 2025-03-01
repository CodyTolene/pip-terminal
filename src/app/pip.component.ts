import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { PipConnectComponent } from './components/pip-connect/pip-connect.component';
import { PipStatusComponent } from './components/pip-status/pip-status.component';
import { PipSubTabModule } from './components/pip-sub-tabs/pip-sub-tab.module';
import { PipTabModule } from './components/pip-tabs/pip-tab.module';

@Component({
  selector: 'pip-mod-terminal',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    PipConnectComponent,
    PipSubTabModule,
    PipTabModule,
    PipStatusComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [],
})
export class PipModTerminalComponent {
  protected signals = pipSignals;
}
