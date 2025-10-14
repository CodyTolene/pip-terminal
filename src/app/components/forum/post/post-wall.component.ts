import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { TableSortChangeEvent } from '@proangular/pro-table';
import { filter } from 'rxjs';
import { ForumPost } from 'src/app/models';
import { AuthService, ForumPostsService } from 'src/app/services';
import { isNonEmptyValue, shareSingleReplay } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { AdsenseUnitComponent } from 'src/app/components/adsense-unit/adsense-unit.component';
import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipForumPostDisplayComponent } from 'src/app/components/forum/post/post-display.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForumPostPagedResult } from 'src/app/types/forum-post-paged-result';
import { PageUrl } from 'src/app/types/page-url';

@UntilDestroy()
@Component({
  selector: 'pip-forum-post-wall',
  templateUrl: './post-wall.component.html',
  imports: [
    AdsenseUnitComponent,
    CommonModule,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    LoadingComponent,
    MatIcon,
    MatTooltip,
    PipButtonComponent,
    PipForumPostDisplayComponent,
    PipPanelComponent,
    PipTitleComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  styleUrl: './post-wall.component.scss',
})
export class PipForumPostWallComponent implements OnInit {
  public constructor() {
    this.postSortOrderFormControl.valueChanges
      .pipe(filter(isNonEmptyValue), untilDestroyed(this))
      .subscribe((sort) => {
        this.postSortSig.set(sort);
        this.postsPageSig.set(null);
        void this.loadFirstPagePosts(sort);
      });

    effect(() => {
      const loading = this.loading();
      if (loading) {
        this.postSortOrderFormControl.disable({ emitEvent: false });
      } else {
        this.postSortOrderFormControl.enable({ emitEvent: false });
      }
    });
  }

  private readonly forumPostsService = inject(ForumPostsService);
  private readonly authService = inject(AuthService);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected readonly postsMaxPerPage = 5;

  private readonly defaultPostsSort: TableSortChangeEvent<ForumPost> = {
    key: 'createdAt',
    direction: 'desc',
  };

  protected readonly postSortOrderFormControl = new FormControl<
    TableSortChangeEvent<ForumPost>
  >(this.defaultPostsSort);

  private readonly pageSig = signal<ForumPostPagedResult | null>(null);

  protected readonly showAds = signal(environment.isProduction);

  protected readonly loading = signal(false);

  private readonly postSortSig = signal<TableSortChangeEvent<ForumPost>>(
    this.defaultPostsSort,
  );

  private readonly postsPageSig = signal<ForumPostPagedResult | null>(null);

  protected readonly posts = computed(() => this.pageSig()?.posts ?? []);

  protected readonly loginLink = loginLink;

  protected readonly registerLink = registerLink;

  protected readonly hasPrevPage = computed(
    () => !!this.pageSig()?.hasMorePrev,
  );

  protected readonly hasNextPage = computed(
    () => !!this.pageSig()?.hasMoreNext,
  );

  public async ngOnInit(): Promise<void> {
    await this.loadFirstPagePosts();
  }

  protected async nextPagePosts(): Promise<void> {
    const page = this.pageSig();
    if (!page?.lastDoc || !page.hasMoreNext) return;

    this.loading.set(true);
    try {
      const next = await this.forumPostsService.getPostsPage({
        pageSize: this.postsMaxPerPage,
        lastDoc: page.lastDoc,
      });
      this.pageSig.set(next);
    } finally {
      this.loading.set(false);
    }
  }

  protected async prevPagePosts(): Promise<void> {
    const page = this.pageSig();
    if (!page?.firstDoc || !page.hasMorePrev) return;

    this.loading.set(true);
    try {
      const prev = await this.forumPostsService.getPostsPage({
        pageSize: this.postsMaxPerPage,
        firstDoc: page.firstDoc,
      });
      this.pageSig.set(prev);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadFirstPagePosts(
    sort: TableSortChangeEvent<ForumPost> = this.postSortSig(),
  ): Promise<void> {
    this.loading.set(true);
    try {
      const first = await this.forumPostsService.getPostsPage({
        pageSize: this.postsMaxPerPage,
        sort,
      });
      this.pageSig.set(first);
    } finally {
      this.loading.set(false);
    }
  }
}

const loginLink = '/' + ('login' satisfies PageUrl);

const registerLink = '/' + ('register' satisfies PageUrl);
