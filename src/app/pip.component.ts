import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs';
import { StripInlineStylesDirective } from 'src/app/directives';
import { Content, Header, Sidenav } from 'src/app/layout';
import {
  AdsService,
  AppUpdateService,
  PageDataService,
  PageMetaService,
  SoundService,
  ThemeService,
} from 'src/app/services';
import { isNonEmptyValue, shareSingleReplay } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
// import { setLogLevel } from '@angular/fire/firestore';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';

import { GdprBanner } from 'src/app/components/gdpr-banner/gdpr-banner';

@UntilDestroy()
@Component({
  selector: 'pip-root',
  templateUrl: './pip.html',
  imports: [
    CommonModule,
    Content,
    GdprBanner,
    Header,
    MatLuxonDateModule,
    Sidenav,
    StripInlineStylesDirective,
  ],
  styleUrl: './pip.scss',
  providers: [PageDataService, PageMetaService, SoundService, ThemeService],
})
export class PipComponent implements OnInit {
  public constructor() {
    // if (!environment.isProduction) {
    //   setLogLevel('debug');
    // }
  }

  private readonly adsService = inject(AdsService);
  private readonly appUpdateService = inject(AppUpdateService);
  private readonly pageDataService = inject(PageDataService);
  private readonly pageMetaService = inject(PageMetaService);
  private readonly themeService = inject(ThemeService);

  private readonly pageDataChanges = this.pageDataService.pageDataChanges.pipe(
    filter(isNonEmptyValue),
    distinctUntilChanged(),
    shareSingleReplay(),
  );

  // Bind the analytics service to the component.
  // https://github.com/angular/angularfire/blob/main/docs/analytics.md
  protected readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  public ngOnInit(): void {
    this.adsService.init();
    this.appUpdateService.init();
    this.themeService.init();

    // Set the default tags for all pages.
    this.pageMetaService.setDefaultTags();

    this.pageDataChanges.pipe(untilDestroyed(this)).subscribe((pageData) => {
      this.pageMetaService.setAuthor(pageData.author);
      this.pageMetaService.setDescription(pageData.description);
      this.pageMetaService.setKeywords(pageData.keywords);
      this.pageMetaService.setTitle(pageData.title);
      const contentHost = document.querySelector(
        'pip-content',
      ) as HTMLElement | null;
      const scrollTarget = contentHost ?? window;
      scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
