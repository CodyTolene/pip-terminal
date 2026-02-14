import { PipBoy3000 } from '@vault-tec/pip-boy';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000-page',
  templateUrl: './pip-boy-3000-page.html',
  imports: [PipBoy3000, RouterModule],
  styleUrl: './pip-boy-3000-page.scss',
  standalone: true,
})
export class PipBoy3000Page {}
