import { ForumCategoryEnum } from 'src/app/enums';
import { PipFooterComponent } from 'src/app/layout';
import { DateTimePipe } from 'src/app/pipes';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { AuthService, ForumService, PostPage } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { ForumHeaderComponent } from 'src/app/components/forum-header/forum-header.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-page',
  standalone: true,
  imports: [
    CommonModule,
    DateTimePipe,
    FormsModule,
    ForumHeaderComponent,
    MatIconModule,
    MatTooltipModule,
    PipButtonComponent,
    PipFooterComponent,
    PipPanelComponent,
    PipTitleComponent,
    RouterModule,
  ],
  providers: [ForumService],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
})
export class ForumPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly forumService = inject(ForumService);

  protected readonly postsMaxPerPage = 5;

  protected readonly ForumCategoryEnum = ForumCategoryEnum;
  protected readonly forumPostViewLink = forumPostViewLink;
  protected readonly loginLink = loginLink;
  protected readonly registerLink = registerLink;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  private readonly pageSig = signal<PostPage | null>(null);

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
      const first = await this.forumService.getPostsPage({
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
      const next = await this.forumService.getPostsPage({
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
      const prev = await this.forumService.getPostsPage({
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
      'Discuss the Pip-Boy 2000 Mk VI as seen in Fallout 76 (year 2102).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_2000_MK_VI],
  },
  {
    key: ForumCategoryEnum.PIP_3000,
    name: ForumCategoryEnum.PIP_3000,
    description:
      'Discussion around the classic Pip-Boy 3000 from Fallout 3 (year 2277).',
    link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000],
  },
  {
    key: ForumCategoryEnum.PIP_3000A,
    name: ForumCategoryEnum.PIP_3000A,
    description:
      'Share tips and stories about the Pip-Boy 3000A model from Fallout: New Vegas (year 2281).',
    link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000A],
  },
  {
    key: ForumCategoryEnum.PIP_3000_MK_IV,
    name: ForumCategoryEnum.PIP_3000_MK_IV,
    description:
      'All things related to the Pip-Boy 3000 Mk IV, as seen in Fallout 4 (year 2287).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000_MK_IV],
  },
  {
    key: ForumCategoryEnum.PIP_3000_MK_V,
    name: ForumCategoryEnum.PIP_3000_MK_V,
    description:
      'Discuss the latest Pip-Boy 3000 Mk V as seen on TV (year 2296).',
    link:
      '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.PIP_3000_MK_V],
  },
];
