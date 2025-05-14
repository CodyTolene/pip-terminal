import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-sponsors-page',
  templateUrl: './sponsors-page.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './sponsors-page.component.scss',
  providers: [],
  standalone: true,
})
export class SponsorsPageComponent {
  protected openSponsorPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}
