import { PipFooterComponent } from 'src/app/layout/footer/footer.component';
import { PAGES } from 'src/app/routing';

import { Component, OnDestroy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-page',
  templateUrl: './pip-boy-3000-mk-v-companion-page.component.html',
  imports: [
    MatExpansionModule,
    PipButtonComponent,
    PipFooterComponent,
    RouterModule,
  ],
  styleUrl: './pip-boy-3000-mk-v-companion-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVCompanionPageComponent implements OnDestroy {
  public constructor(private scriptsService: ScriptsService) {
    this.scriptsService.loadScript('pip/webtools/uart.js');
  }

  protected readonly PAGES = PAGES;

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
  }

  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }
}
