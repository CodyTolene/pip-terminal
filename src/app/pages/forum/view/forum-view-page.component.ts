import { FormDirective, InputTextareaComponent } from '@proangular/pro-form';
import { TableSortChangeEvent } from '@proangular/pro-table';
import { firstValueFrom } from 'rxjs';
import { PipFooterComponent } from 'src/app/layout';
import {
  CommentFormGroup,
  commentFormGroup,
} from 'src/app/pages/forum/view/comment-form-group';
import {
  AuthService,
  ForumCommentsService,
  ForumPostsService,
  ToastService,
} from 'src/app/services';
import { isNonEmptyString, shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipForumCommentComponent } from 'src/app/components/forum/comment/forum-comment.component';
import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header.component';
import { PipForumPostComponent } from 'src/app/components/forum/post/forum-post.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';

import { ForumComment } from 'src/app/models/forum-comment.model';
import { ForumPost } from 'src/app/models/forum-post.model';

import { ForumCommentPagedResult } from 'src/app/types/forum-comment-paged-result';
import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-view-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    InputTextareaComponent,
    PipButtonComponent,
    PipFooterComponent,
    PipForumCommentComponent,
    PipForumPostComponent,
    PipPanelComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [ForumCommentsService, ForumPostsService],
  templateUrl: './forum-view-page.component.html',
  styleUrls: ['./forum-view-page.component.scss'],
})
export class ForumViewPageComponent extends FormDirective<CommentFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();

    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
      this.loadFirstPageComments(postId);
    } else {
      this.loading.set(false);
      this.error.set(true);
    }

    effect(() => {
      const isSubmitting = this.isSubmitting();
      if (isSubmitting) {
        this.formGroup.controls.content.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.content.enable({ emitEvent: false });
      }
    });
  }

  private readonly authService = inject(AuthService);
  private readonly forumCommentsService = inject(ForumCommentsService);
  private readonly forumPostsService = inject(ForumPostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);

  protected override readonly formGroup = commentFormGroup;

  protected readonly forumLink = forumLink;
  protected readonly loginLink = loginLink;

  protected readonly commentsMaxPerPage = 10;
  private readonly defaultCommentSort: TableSortChangeEvent<ForumComment> = {
    key: 'createdAt',
    direction: 'desc',
  };

  private readonly commentsPageSig = signal<ForumCommentPagedResult | null>(
    null,
  );
  protected readonly error = signal<boolean>(false);
  protected readonly isReplying = signal(false);
  protected readonly isSubmitting = signal(false);
  protected readonly loading = signal<boolean>(true);
  protected readonly loadingComments = signal<boolean>(false);

  protected readonly post = signal<ForumPost | null>(null);
  protected readonly comments = computed(
    () => this.commentsPageSig()?.comments ?? [],
  );
  protected readonly hasPrevCommentsPage = computed(
    () => !!this.commentsPageSig()?.hasMorePrev,
  );
  protected readonly hasNextCommentsPage = computed(
    () => !!this.commentsPageSig()?.hasMoreNext,
  );

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected cancelComment(): void {
    if (this.isSubmitting()) return;
    this.formGroup.reset();
    this.isReplying.set(false);
  }

  protected getReturnUrlQueryParams(): object {
    return { returnUrl: window.location.pathname };
  }

  protected async submitComment(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { content } = this.formGroup.value;
      if (!isNonEmptyString(content)) {
        throw new Error('Content must not be empty!');
      }

      const user = await firstValueFrom(this.userChanges);
      if (!user || user === null) {
        console.error('User must be logged in to submit a comment');
        return;
      }

      const post = this.post();
      if (!post) {
        console.error('Post must be loaded to submit a comment');
        return;
      }

      await this.forumCommentsService.addComment({
        authorId: user.uid,
        authorName: user.displayName || user.email,
        content,
        postId: post.id,
      });

      this.toastService.success({
        message: 'Comment added successfully!',
        durationSecs: 3,
      });

      this.formGroup.controls.content.setValue('', { emitEvent: false });
      this.formGroup.controls.content.markAsPristine({ emitEvent: false });
      this.formGroup.controls.content.markAsUntouched({ emitEvent: false });
      this.isSubmitting.set(false);
      this.isReplying.set(false);

      await this.loadFirstPageComments(post.id);
    } catch (e) {
      console.error('Failed to create comment:', e);
      this.toastService.error({
        message: 'Failed to submit comment. Please try again later.',
        durationSecs: 3,
      });
      this.isSubmitting.set(false);
    }
  }

  protected async loadFirstPageComments(postId: string): Promise<void> {
    this.loadingComments.set(true);
    try {
      const first = await this.forumCommentsService.getCommentsPage(postId, {
        pageSize: this.commentsMaxPerPage,
        sort: this.defaultCommentSort,
      });
      this.commentsPageSig.set(first);
    } finally {
      this.loadingComments.set(false);
    }
  }

  protected async nextPageComments(): Promise<void> {
    const page = this.commentsPageSig();
    const post = this.post();
    if (!post || !page?.lastDoc || !page.hasMoreNext) return;

    this.loadingComments.set(true);
    try {
      const next = await this.forumCommentsService.getCommentsPage(post.id, {
        pageSize: this.commentsMaxPerPage,
        lastDoc: page.lastDoc,
        sort: this.defaultCommentSort,
      });
      this.commentsPageSig.set(next);
    } finally {
      this.loadingComments.set(false);
    }
  }

  protected async prevPageComments(): Promise<void> {
    const page = this.commentsPageSig();
    const post = this.post();
    if (!post || !page?.firstDoc || !page.hasMorePrev) return;

    this.loadingComments.set(true);
    try {
      const prev = await this.forumCommentsService.getCommentsPage(post.id, {
        pageSize: this.commentsMaxPerPage,
        firstDoc: page.firstDoc,
        sort: this.defaultCommentSort,
      });
      this.commentsPageSig.set(prev);
    } finally {
      this.loadingComments.set(false);
    }
  }

  private async loadPost(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const post = await firstValueFrom(this.forumPostsService.getPost(id));
      if (!post) throw new Error('Post not found');
      this.post.set(post);
      this.loading.set(false);
    } catch (err) {
      console.error('Failed to load forum post', err);
      this.error.set(true);
      this.loading.set(false);
    }
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
const loginLink = '/' + ('login' satisfies PageUrl);
