import { PipFooterComponent } from 'src/app/layout/footer/footer';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-boy-3000a-companion-page',
  templateUrl: './pip-boy-3000a-companion-page.html',
  imports: [PipFooterComponent, PipTitleComponent, RouterModule],
  styleUrl: './pip-boy-3000a-companion-page.scss',
  standalone: true,
})
export class PipBoy3000aPage {}
