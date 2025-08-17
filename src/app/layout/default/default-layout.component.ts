import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipHeaderComponent } from 'src/app/layout/header/header.component';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { environment } from 'src/environments/environment';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-default-layout',
  template: `
    <pip-header />
    <!-- TODO -->
    @if (!isProduction) {
      <pip-navbar />
    }
    <pip-content />
  `,
  styleUrl: './default-layout.component.scss',
  imports: [ContentComponent, NavbarComponent, PipHeaderComponent],
  standalone: true,
})
export class DefaultLayoutComponent {
  protected readonly isProduction = environment.isProduction;
}
