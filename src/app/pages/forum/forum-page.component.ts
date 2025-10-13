import { ForumCategoryEnum } from 'src/app/enums';
import { PipFooterComponent } from 'src/app/layout';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { AuthService, ForumPostsService } from 'src/app/services';
import {
  randomIntBetween as _randomIntBetween,
  shareSingleReplay,
} from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { AdsenseUnitComponent } from 'src/app/components/adsense-unit/adsense-unit.component';
import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header.component';
import { PipForumPostComponent } from 'src/app/components/forum/post/forum-post.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForumPostPagedResult } from 'src/app/types/forum-post-paged-result';
import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-page',
  standalone: true,
  imports: [
    AdsenseUnitComponent,
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    LoadingComponent,
    MatIconModule,
    MatTooltipModule,
    PipButtonComponent,
    PipFooterComponent,
    PipForumPostComponent,
    PipPanelComponent,
    PipTitleComponent,
    RouterModule,
  ],
  providers: [ForumPostsService],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
})
export class ForumPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly forumPostsService = inject(ForumPostsService);

  protected readonly postsMaxPerPage = 5;

  protected readonly ForumCategoryEnum = ForumCategoryEnum;
  protected readonly forumPostViewLink = forumPostViewLink;
  protected readonly loginLink = loginLink;
  protected readonly registerLink = registerLink;
  protected readonly showAds = signal(environment.isProduction);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  private readonly pageSig = signal<ForumPostPagedResult | null>(null);

  protected readonly loading = signal(false);

  protected readonly posts = computed(() => this.pageSig()?.posts ?? []);

  protected readonly hasPrevPage = computed(
    () => !!this.pageSig()?.hasMorePrev,
  );

  protected readonly hasNextPage = computed(
    () => !!this.pageSig()?.hasMoreNext,
  );

  protected readonly categories = categories;

  public async ngOnInit(): Promise<void> {
    await this.loadFirstPagePosts();
  }

  protected async loadFirstPagePosts(): Promise<void> {
    this.loading.set(true);
    try {
      const first = await this.forumPostsService.getPostsPage({
        pageSize: this.postsMaxPerPage,
      });
      this.pageSig.set(first);
    } finally {
      this.loading.set(false);
    }
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
}

const forumPostViewLink = '/' + ('forum/post' satisfies PageUrl) + '/';
const loginLink = '/' + ('login' satisfies PageUrl);
const registerLink = '/' + ('register' satisfies PageUrl);
const categories = [
  {
    key: ForumCategoryEnum.GENERAL,
    name: ForumCategoryEnum.GENERAL,
    description: 'General discussion about all things Pip-Boy related.',
    link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.GENERAL],
  },
  {
    key: ForumCategoryEnum.PIP_2000_MK_VI,
    name: ForumCategoryEnum.PIP_2000_MK_VI,
    description:
      'Discuss the Pip-Boy 2000 Mk VI as seen in the game Fallout 76 (year 2102).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_2000_MK_VI],
  },
  {
    key: ForumCategoryEnum.PIP_3000,
    name: ForumCategoryEnum.PIP_3000,
    description:
      'Discuss the Pip-Boy 3000 as seen in the game Fallout 3 (year 2277).',
    link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000],
  },
  {
    key: ForumCategoryEnum.PIP_3000A,
    name: ForumCategoryEnum.PIP_3000A,
    description:
      'Discuss the Pip-Boy 3000A as seen in the game Fallout: New Vegas (year 2281).',
    link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000A],
  },
  {
    key: ForumCategoryEnum.PIP_3000_MK_IV,
    name: ForumCategoryEnum.PIP_3000_MK_IV,
    description:
      'Discuss the Pip-Boy 3000 Mk IV as seen in the game Fallout 4 (year 2287).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000_MK_IV],
  },
  {
    key: ForumCategoryEnum.PIP_3000_MK_V,
    name: ForumCategoryEnum.PIP_3000_MK_V,
    description:
      'Discuss the Pip-Boy 3000 Mk V as seen on Amazon TV (year 2296).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000_MK_V],
  },
];
