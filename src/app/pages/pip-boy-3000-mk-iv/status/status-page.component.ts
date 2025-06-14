import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { pipSignals } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PipBoy3000TabsService } from 'src/app/services/pip-boy-3000-mk-iv/pip-boy-3000-tabs.service';

@Component({
  selector: 'pip-status-page',
  templateUrl: './status-page.component.html',
  imports: [CommonModule, MatIconModule],
  styleUrl: './status-page.component.scss',
  standalone: true,
})
export class StatusPageComponent {
  public constructor(protected readonly tabsService: PipBoy3000TabsService) {}

  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  protected readonly signals = pipSignals;
}
