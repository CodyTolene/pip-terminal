import { PipFooterComponent } from 'src/app/layout/footer/footer';
import { PAGES } from 'src/app/routing';

import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-page',
  templateUrl: './pip-boy-3000-mk-v-companion-page.html',
  imports: [
    MatExpansionModule,
    PipButtonComponent,
    PipFooterComponent,
    PipTitleComponent,
    RouterModule,
  ],
  styleUrl: './pip-boy-3000-mk-v-companion-page.scss',
  standalone: true,
})
export class PipBoy3000MkVPage {
  protected readonly PAGES = PAGES;

  protected openAppsRepo(): void {
    window.open(
      'https://github.com/CodyTolene/pip-boy-3000-mk-v-apps',
      '_blank',
    );
  }
}
