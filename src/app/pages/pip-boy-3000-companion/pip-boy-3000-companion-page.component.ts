import { PipFooterComponent } from 'src/app/layout';
import { PAGES } from 'src/app/routing';

import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'pip-boy-3000-companion-page',
  templateUrl: './pip-boy-3000-companion-page.component.html',
  imports: [
    MatExpansionModule,
    PipButtonComponent,
    PipFooterComponent,
    PipTitleComponent,
    RouterModule,
  ],
  styleUrl: './pip-boy-3000-companion-page.component.scss',
  standalone: true,
})
export class PipBoy3000CompanionPageComponent {
  protected readonly PAGES = PAGES;

  protected openBethesdaGearPage(): void {
    window.open(
      'https://gear.bethesda.net/products/fallout-pip-boy-3000-replica',
      '_blank',
    );
  }

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}
