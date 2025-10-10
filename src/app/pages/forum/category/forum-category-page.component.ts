import { PipFooterComponent } from 'src/app/layout';
import { SLUG_TO_CATEGORY } from 'src/app/routing';
import { AuthService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ForumHeaderComponent } from 'src/app/components/forum-header/forum-header.component';
import { ForumTableComponent } from 'src/app/components/forum-table/forum-table.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-category-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    ForumTableComponent,
    PipTitleComponent,
    ReactiveFormsModule,
    RouterModule,
    PipFooterComponent,
  ],
  templateUrl: './forum-category-page.component.html',
  styleUrls: ['./forum-category-page.component.scss'],
})
export class ForumCategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected readonly forumLink = '/' + ('forum' satisfies PageUrl);

  private readonly slug = computed(() =>
    (this.route.snapshot.paramMap.get('id') ?? '').toLowerCase(),
  );
  protected readonly category = computed(
    () => SLUG_TO_CATEGORY[this.slug() as keyof typeof SLUG_TO_CATEGORY],
  );
}
