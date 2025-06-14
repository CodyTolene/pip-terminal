import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { TabsService } from 'src/app/services/tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [CommonModule, MatIconModule],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {
  public constructor(protected readonly tabsService: TabsService) {}

  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  protected readonly signals = pipSignals;
}
