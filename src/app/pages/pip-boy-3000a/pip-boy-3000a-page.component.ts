import { PipBoy3000a } from '@vault-tec/pip-boy';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000a-page',
  templateUrl: './pip-boy-3000a-page.component.html',
  imports: [PipBoy3000a, RouterModule],
  styleUrl: './pip-boy-3000a-page.component.scss',
  standalone: true,
})
export class PipBoy3000APageComponent {}
