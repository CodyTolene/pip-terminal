import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateTimePipe } from '@proangular/pro-form';
import { ForumComment } from 'src/app/models';
import {
  AuthService,
  ForumCommentsService,
  ToastService,
} from 'src/app/services';
import {
  getFirstNonEmptyValueFrom,
  shareSingleReplay,
} from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

import { PageUrl } from 'src/app/types/page-url';

@UntilDestroy()
@Component({
  selector: 'pip-forum-comment-display[comment]',
  templateUrl: './comment-display.component.html',
  imports: [CommonModule, DateTimePipe, MatIcon, MatTooltip, RouterModule],
  styleUrl: './comment-display.component.scss',
})
export class PipForumCommentDisplayComponent {
  private readonly authService = inject(AuthService);
  private readonly commentsService = inject(ForumCommentsService);
  private readonly dialog = inject(MatDialog);
  private readonly toastService = inject(ToastService);

  public readonly comment = input.required<ForumComment>();

  protected readonly loginLink = loginLink;

  private readonly likesDelta = signal(0);
  public readonly likesCountShown = computed(() => {
    const base = this.comment()?.likesCount ?? 0;
    const shown = base + this.likesDelta();
    return shown < 0 ? 0 : shown;
  });
  private readonly resetLikesDelta = effect(() => {
    this.comment();
    this.likesDelta.set(0);
  });

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected getReturnUrlQueryParams(): object {
    return { returnUrl: window.location.pathname };
  }

  protected async onFlagCommentClick(): Promise<void> {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to report this comment?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldFlag) => {
        if (!shouldFlag) {
          return;
        }

        await this.flagComment();
      });
  }

  protected async onLikeCommentClick(): Promise<void> {
    const comment = this.comment();
    const user = await getFirstNonEmptyValueFrom(this.authService.userChanges);
    const result = await this.commentsService.likeComment(
      comment.postId,
      comment.id,
      user.uid,
    );

    if (result.ok) {
      this.toastService.success({ message: 'Comment liked.' });
      this.likesDelta.update((n) => n + 1);
    } else if (result.reason === 'already-liked') {
      this.unlikeComment();
    } else if (result.reason === 'needs-auth') {
      this.toastService.error({ message: 'Sign in to like comments.' });
    } else {
      this.toastService.error({ message: 'Failed to like comment.' });
    }
  }

  private async flagComment(): Promise<void> {
    const comment = this.comment();
    const user = await getFirstNonEmptyValueFrom(this.authService.userChanges);
    const result = await this.commentsService.flagComment(
      comment.postId,
      comment.id,
      user.uid,
      'TEST_REASON',
    );

    if (result.ok) {
      this.toastService.success({
        message: 'Thanks, your report was received.',
      });
    } else if (result.reason === 'already-flagged') {
      this.unflagComment();
    } else if (result.reason === 'needs-auth') {
      this.toastService.error({ message: 'Sign in to flag comments.' });
    } else {
      this.toastService.error({ message: 'Failed to flag comment.' });
    }
  }

  private unflagComment(): void {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Unflag',
        dialogTitle: 'Already Reported',
        messageTitle: '',
        message: `You already flagged this comment, would you like to unflag it?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldUnflag) => {
        if (!shouldUnflag) return;

        const comment = this.comment();
        const user = await getFirstNonEmptyValueFrom(
          this.authService.userChanges,
        );
        const result = await this.commentsService.unflagComment(
          comment.postId,
          comment.id,
          user.uid,
        );

        if (result.ok) {
          this.toastService.success({ message: 'Comment unflagged.' });
        } else if (result.reason === 'needs-auth') {
          this.toastService.error({ message: 'Sign in to unflag comments.' });
        } else if (result.reason === 'not-owner') {
          this.toastService.error({
            message: 'You can only unflag your own flags.',
          });
        } else if (result.reason === 'retry-later') {
          this.toastService.error({
            message: 'Network error, please try again later.',
          });
        } else {
          this.toastService.error({ message: 'Failed to unflag comment.' });
        }
      });
  }

  private unlikeComment(): void {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        cancelButtonLabel: 'Cancel',
        confirmButtonLabel: 'Unlike',
        dialogTitle: 'Already Liked',
        messageTitle: '',
        message: `You already liked this comment, do you want to unlike it?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldUnlike) => {
        if (!shouldUnlike) return;

        const comment = this.comment();
        const user = await getFirstNonEmptyValueFrom(
          this.authService.userChanges,
        );
        const result = await this.commentsService.unlikeComment(
          comment.postId,
          comment.id,
          user.uid,
        );

        if (result.ok) {
          this.toastService.success({ message: 'Comment unliked.' });
          this.likesDelta.update((n) => n - 1);
        } else if (result.reason === 'needs-auth') {
          this.toastService.error({ message: 'Sign in to unlike comments.' });
        } else if (result.reason === 'not-owner') {
          this.toastService.error({
            message: 'You can only unlike your own likes.',
          });
        } else if (result.reason === 'retry-later') {
          this.toastService.error({
            message: 'Network error, please try again later.',
          });
        } else {
          this.toastService.error({ message: 'Failed to unlike comment.' });
        }
      });
  }
}

const loginLink = '/' + ('login' satisfies PageUrl);
