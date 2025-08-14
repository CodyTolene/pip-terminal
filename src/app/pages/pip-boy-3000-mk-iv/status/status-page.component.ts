import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { pipSignals } from 'src/app/signals';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'pip-boy-3000-mk-iv-status-page',
  templateUrl: './status-page.component.html',
  imports: [MatIconModule],
  styleUrl: './status-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkIVStatusPageComponent {
  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  protected readonly signals = pipSignals;
}
