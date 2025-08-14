import { PipHeaderComponent } from 'src/app/layout/header/header.component';

import { Component } from '@angular/core';

import { ContentComponent } from '../content/content.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-layout',
  template: `
    <pip-header />
    <pip-navbar />
    <pip-content />
  `,
  imports: [PipHeaderComponent, ContentComponent, NavbarComponent],
  styleUrl: './pip-boy-3000-mk-v-companion-layout.component.scss',
  providers: [],
  standalone: true,
})
export class PipBoy3000MkVCompanionLayoutComponent {}
