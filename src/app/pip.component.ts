import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs';
import { PipBoy2000MkVILayoutComponent } from 'src/app/layout/pip-boy-2000-mk-vi/pip-boy-2000-mk-vi-layout.component';
import { PipBoy3000MkIVLayoutComponent } from 'src/app/layout/pip-boy-3000-mk-iv/pip-boy-3000-mk-iv-layout.component';
import { PipBoy3000MkVCompanionLayoutComponent } from 'src/app/layout/pip-boy-3000-mk-v-companion/pip-boy-3000-mk-v-companion-layout.component';
import { PipBoy3000LayoutComponent } from 'src/app/layout/pip-boy-3000/pip-boy-3000-layout.component';
import { PipBoy3000ALayoutComponent } from 'src/app/layout/pip-boy-3000a/pip-boy-3000a-layout.component';
import { WelcomePageComponent } from 'src/app/pages/welcome/welcome-page.component';
import { pipUrlSignal } from 'src/app/signals';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { PageMetaService } from 'src/app/services/page-meta.service';

import { PipCompanionUrlsEnum, PipUrlsEnum } from './enums';
import { SoundService } from './services/sound.service';

@UntilDestroy()
@Component({
  selector: 'pip-root',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    MatLuxonDateModule,
    PipBoy2000MkVILayoutComponent,
    PipBoy3000ALayoutComponent,
    PipBoy3000LayoutComponent,
    PipBoy3000MkIVLayoutComponent,
    PipBoy3000MkVCompanionLayoutComponent,
    WelcomePageComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [PageMetaService, SoundService],
})
export class PipComponent implements OnInit {
  public constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly pageMetaService: PageMetaService,
    private readonly router: Router,
  ) {}

  // Bind the services to the component.
  // https://github.com/angular/angularfire/blob/main/docs/analytics.md
  protected readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  protected readonly PipUrlsEnum = PipUrlsEnum;
  protected readonly pipUrlSignal = pipUrlSignal;

  public ngOnInit(): void {
    // Set the default tags for the page.
    this.pageMetaService.setTags();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        untilDestroyed(this),
      )
      .subscribe(() => {
        let route = this.activatedRoute;
        const fullPathSegments: string[] = [];

        while (route.firstChild) {
          route = route.firstChild;
          fullPathSegments.push(...route.snapshot.url.map((seg) => seg.path));
        }

        if (fullPathSegments.includes(PipUrlsEnum.PIP_2000_MK_VI)) {
          this.pipUrlSignal.set(PipUrlsEnum.PIP_2000_MK_VI);
          return;
        }

        if (fullPathSegments.includes(PipUrlsEnum.PIP_3000_MK_IV)) {
          this.pipUrlSignal.set(PipUrlsEnum.PIP_3000_MK_IV);
          return;
        }

        if (
          fullPathSegments.includes(PipUrlsEnum.PIP_3000_MK_V) ||
          fullPathSegments.includes(PipCompanionUrlsEnum.PIP_3000_MK_V_APPS) ||
          fullPathSegments.includes(
            PipCompanionUrlsEnum.PIP_3000_MK_V_MAINTENANCE,
          )
        ) {
          this.pipUrlSignal.set(PipUrlsEnum.PIP_3000_MK_V);
          return;
        }

        if (fullPathSegments.includes(PipUrlsEnum.PIP_3000A)) {
          this.pipUrlSignal.set(PipUrlsEnum.PIP_3000A);
          return;
        }

        if (fullPathSegments.includes(PipUrlsEnum.PIP_3000)) {
          this.pipUrlSignal.set(PipUrlsEnum.PIP_3000);
          return;
        }

        this.pipUrlSignal.set(PipUrlsEnum.NONE);
        this.pageMetaService.setTitle('Welcome!');
      });
  }
}
