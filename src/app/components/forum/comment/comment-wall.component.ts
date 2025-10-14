import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { TableSortChangeEvent } from '@proangular/pro-table';
import { filter } from 'rxjs';
import { ForumComment, ForumPost } from 'src/app/models';
import { ForumCommentsService } from 'src/app/services';
import { isNonEmptyValue } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import {
  Component,
  Input,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { AdsenseUnitComponent } from 'src/app/components/adsense-unit/adsense-unit.component';
import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipForumCommentDisplayComponent } from 'src/app/components/forum/comment/comment-display.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForumCommentPagedResult } from 'src/app/types/forum-comment-paged-result';

@UntilDestroy()
@Component({
  selector: 'pip-comment-wall[post]',
  templateUrl: './comment-wall.component.html',
  imports: [
    AdsenseUnitComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    LoadingComponent,
    MatIcon,
    MatTooltip,
    PipButtonComponent,
    PipForumCommentDisplayComponent,
    PipPanelComponent,
    PipTitleComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './comment-wall.component.scss',
  providers: [ForumCommentsService],
  standalone: true,
})
export class PipCommentWallComponent implements OnInit {
  public constructor() {
    this.commentSortOrderFormControl.valueChanges
      .pipe(filter(isNonEmptyValue), untilDestroyed(this))
      .subscribe((sort) => {
        this.commentSortSig.set(sort);
        this.commentsPageSig.set(null);
        void this.loadFirstPageComments(this.post.id, sort);
      });

    effect(() => {
      const loadingComments = this.loadingComments();
      if (loadingComments) {
        this.commentSortOrderFormControl.disable({ emitEvent: false });
      } else {
        this.commentSortOrderFormControl.enable({ emitEvent: false });
      }
    });
  }

  private readonly forumCommentsService = inject(ForumCommentsService);

  @Input({ required: true }) public post!: ForumPost;

  protected readonly commentsMaxPerPage = 5;
  private readonly defaultCommentSort: TableSortChangeEvent<ForumComment> = {
    key: 'createdAt',
    direction: 'desc',
  };

  protected readonly commentSortOrderFormControl = new FormControl<
    TableSortChangeEvent<ForumComment>
  >(this.defaultCommentSort);

  protected readonly loadingComments = signal<boolean>(false);

  protected readonly showAds = signal(environment.isProduction);

  private readonly commentSortSig = signal<TableSortChangeEvent<ForumComment>>(
    this.defaultCommentSort,
  );

  private readonly commentsPageSig = signal<ForumCommentPagedResult | null>(
    null,
  );

  protected readonly comments = computed(
    () => this.commentsPageSig()?.comments ?? [],
  );

  protected readonly hasPrevCommentsPage = computed(
    () => !!this.commentsPageSig()?.hasMorePrev,
  );

  protected readonly hasNextCommentsPage = computed(
    () => !!this.commentsPageSig()?.hasMoreNext,
  );

  public ngOnInit(): void {
    this.loadFirstPageComments(this.post.id);
  }

  public async reload(): Promise<void> {
    this.commentsPageSig.set(null);
    void (await this.loadFirstPageComments(
      this.post.id,
      this.commentSortSig(),
    ));
  }

  protected async nextPageComments(): Promise<void> {
    const page = this.commentsPageSig();
    if (!this.post || !page?.lastDoc || !page.hasMoreNext) return;

    this.loadingComments.set(true);
    try {
      const next = await this.forumCommentsService.getCommentsPage(
        this.post.id,
        {
          pageSize: this.commentsMaxPerPage,
          lastDoc: page.lastDoc,
          sort: this.commentSortSig(),
        },
      );
      this.commentsPageSig.set(next);
    } finally {
      this.loadingComments.set(false);
    }
  }

  protected async prevPageComments(): Promise<void> {
    const page = this.commentsPageSig();
    if (!this.post || !page?.firstDoc || !page.hasMorePrev) return;

    this.loadingComments.set(true);
    try {
      const prev = await this.forumCommentsService.getCommentsPage(
        this.post.id,
        {
          pageSize: this.commentsMaxPerPage,
          firstDoc: page.firstDoc,
          sort: this.commentSortSig(),
        },
      );
      this.commentsPageSig.set(prev);
    } finally {
      this.loadingComments.set(false);
    }
  }

  private async loadFirstPageComments(
    postId: string,
    sort: TableSortChangeEvent<ForumComment> = this.commentSortSig(),
  ): Promise<void> {
    this.loadingComments.set(true);
    try {
      const first = await this.forumCommentsService.getCommentsPage(postId, {
        pageSize: this.commentsMaxPerPage,
        sort,
      });
      this.commentsPageSig.set(first);
    } finally {
      this.loadingComments.set(false);
    }
  }
}
