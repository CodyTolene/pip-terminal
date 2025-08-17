import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipHeaderComponent } from 'src/app/layout/header/header.component';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { environment } from 'src/environments/environment';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-layout',
  template: `
    <pip-header />
    <!-- TODO -->
    @if (isProduction) {
      <pip-navbar />
    }
    <pip-content />
  `,
  imports: [PipHeaderComponent, ContentComponent, NavbarComponent],
  styleUrl: './pip-boy-3000-mk-v-companion-layout.component.scss',
  providers: [],
  standalone: true,
})
export class PipBoy3000MkVCompanionLayoutComponent {
  protected readonly isProduction = environment.isProduction;
}
