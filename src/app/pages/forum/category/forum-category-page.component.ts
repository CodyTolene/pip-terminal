import { SLUG_TO_CATEGORY } from 'src/app/routing';

import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ForumTableComponent } from 'src/app/components/forum-table/forum-table.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-category-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumTableComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forum-category-page.component.html',
  styleUrls: ['./forum-category-page.component.scss'],
})
export class ForumCategoryPageComponent {
  private route = inject(ActivatedRoute);

  protected readonly forumLink = '/' + ('forum' satisfies PageUrl);

  private readonly slug = computed(() =>
    (this.route.snapshot.paramMap.get('id') ?? '').toLowerCase(),
  );
  protected readonly category = computed(
    () => SLUG_TO_CATEGORY[this.slug() as keyof typeof SLUG_TO_CATEGORY],
  );
}
