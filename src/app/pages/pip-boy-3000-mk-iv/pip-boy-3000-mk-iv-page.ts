import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { pipSignals } from 'src/app/signals';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000-mk-iv-page',
  templateUrl: './pip-boy-3000-mk-iv-page.html',
  imports: [MatIconModule, RouterModule],
  styleUrl: './pip-boy-3000-mk-iv-page.scss',
  standalone: true,
})
export class PipBoy3000MkIVPage {
  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  protected readonly signals = pipSignals;
}
