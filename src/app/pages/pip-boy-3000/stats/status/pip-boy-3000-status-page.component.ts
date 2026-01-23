import { PipBoy3000 } from '@vault-tec/pip-boy';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000-status-page',
  templateUrl: './pip-boy-3000-status-page.component.html',
  imports: [PipBoy3000, RouterModule],
  styleUrl: './pip-boy-3000-status-page.component.scss',
  standalone: true,
})
export class PipBoy3000StatusPageComponent {}
