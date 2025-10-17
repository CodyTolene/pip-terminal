import { DateTime } from 'luxon';
import { ForumCategoryEnum } from 'src/app/enums';
import { PipFooterComponent } from 'src/app/layout';
import { CATEGORY_TO_SLUG } from 'src/app/routing';
import { AuthService, ForumPostsService } from 'src/app/services';
import {
  randomIntBetween as _randomIntBetween,
  shareSingleReplay,
} from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header.component';
import { PipForumPostWallComponent } from 'src/app/components/forum/post/post-wall.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'pip-forum-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    MatIconModule,
    MatTooltipModule,
    PipFooterComponent,
    PipForumPostWallComponent,
    PipTitleComponent,
    RouterModule,
  ],
  providers: [ForumPostsService],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
})
export class ForumPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected readonly categories: readonly ForumCategory[] = [
    {
      key: ForumCategoryEnum.ANNOUNCEMENTS,
      name: ForumCategoryEnum.ANNOUNCEMENTS,
      description:
        'Official announcements from web administrators and moderators.',
      link:
        '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.ANNOUNCEMENTS],
    },
    {
      key: ForumCategoryEnum.COSPLAY,
      name: ForumCategoryEnum.COSPLAY,
      description:
        'Show off costumes and props, swap techniques, and get or give advice.',
      link: '/forum/category/' + CATEGORY_TO_SLUG[ForumCategoryEnum.COSPLAY],
    },
    {
      key: ForumCategoryEnum.GENERAL,
      name: ForumCategoryEnum.GENERAL,
      description: `Discuss all things that are Pip-Boy or website related (year ${DateTime.now().year}).`,
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
}

interface ForumCategory {
  key: ForumCategoryEnum;
  name: string;
  description: string;
  link: string;
}
