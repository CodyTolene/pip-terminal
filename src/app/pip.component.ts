import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { PageLayoutsEnum } from 'src/app/enums';
import {
  PipBoy2000MkVILayoutComponent,
  PipBoy3000ALayoutComponent,
  PipBoy3000LayoutComponent,
  PipBoy3000MkIVLayoutComponent,
  PipBoy3000MkVCompanionLayoutComponent,
} from 'src/app/layout';
import { DefaultLayoutComponent } from 'src/app/layout/default/default-layout.component';
import {
  PageDataService,
  PageMetaService,
  SoundService,
} from 'src/app/services';
import { isNonEmptyValue, shareSingleReplay } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Analytics } from '@angular/fire/analytics';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';

@UntilDestroy()
@Component({
  selector: 'pip-root',
  templateUrl: './pip.component.html',
  imports: [
    CommonModule,
    DefaultLayoutComponent,
    MatLuxonDateModule,
    PipBoy2000MkVILayoutComponent,
    PipBoy3000ALayoutComponent,
    PipBoy3000LayoutComponent,
    PipBoy3000MkIVLayoutComponent,
    PipBoy3000MkVCompanionLayoutComponent,
  ],
  styleUrl: './pip.component.scss',
  providers: [PageDataService, PageMetaService, SoundService],
})
export class PipComponent implements OnInit {
  private readonly pageDataService = inject(PageDataService);
  private readonly pageMetaService = inject(PageMetaService);

  private readonly pageDataChanges = this.pageDataService.pageDataChanges.pipe(
    filter(isNonEmptyValue),
    distinctUntilChanged(),
    shareSingleReplay(),
  );

  protected readonly pageLayoutChanges = this.pageDataChanges.pipe(
    map((pageData) => pageData.layout),
  );

  // Bind the analytics service to the component.
  // https://github.com/angular/angularfire/blob/main/docs/analytics.md
  protected readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  protected readonly PageLayoutsEnum = PageLayoutsEnum;

  public ngOnInit(): void {
    // Set the default tags for all pages.
    this.pageMetaService.setDefaultTags();

    this.pageDataChanges.pipe(untilDestroyed(this)).subscribe((pageData) => {
      this.pageMetaService.setAuthor(pageData.author);
      this.pageMetaService.setDescription(pageData.description);
      this.pageMetaService.setKeywords(pageData.keywords);
      this.pageMetaService.setTitle(pageData.title);
    });
  }
}
