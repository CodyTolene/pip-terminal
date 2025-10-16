import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DateTimePipe } from '@proangular/pro-form';
import { ForumPost } from 'src/app/models';
import { AuthService, ForumPostsService, ToastService } from 'src/app/services';
import {
  getFirstNonEmptyValueFrom,
  shareSingleReplay,
} from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  booleanAttribute,
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

@UntilDestroy()
@Component({
  selector: 'pip-forum-post-display[post]',
  templateUrl: './post-display.component.html',
  imports: [CommonModule, DateTimePipe, MatIcon, MatTooltip, RouterModule],
  styleUrl: './post-display.component.scss',
})
export class PipForumPostDisplayComponent {
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly postService = inject(ForumPostsService);
  private readonly toastService = inject(ToastService);

  @Input({ transform: booleanAttribute })
  public linkedPost = false;

  @Input({ transform: booleanAttribute })
  public simple = false;

  public readonly post = input.required<ForumPost>();

  private readonly likesDelta = signal(0);
  public readonly likesCountShown = computed(() => {
    const base = this.post()?.likesCount ?? 0;
    const shown = base + this.likesDelta();
    return shown < 0 ? 0 : shown;
  });
  private readonly resetLikesDelta = effect(() => {
    this.post();
    this.likesDelta.set(0);
  });

  public readonly spoilerRevealed = signal(false);
  private readonly resetSpoiler = effect(() => {
    this.post();
    this.spoilerRevealed.set(false);
  });

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected async onFlagPostClick(): Promise<void> {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to report this post?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldFlag) => {
        if (!shouldFlag) {
          return;
        }

        await this.flagPost();
      });
  }

  protected async onLikePostClick(): Promise<void> {
    const post = this.post();
    const user = await getFirstNonEmptyValueFrom(this.authService.userChanges);
    const result = await this.postService.likePost(post.id, user.uid);

    if (result.ok) {
      this.toastService.success({
        message: 'Post liked.',
      });
      // Update the post locally with the new count
      this.likesDelta.update((n) => n + 1);
    } else if (result.reason === 'already-liked') {
      this.unlikePost();
    } else if (result.reason === 'needs-auth') {
      this.toastService.error({
        message: 'Sign in to like posts.',
      });
    } else {
      this.toastService.error({
        message: 'Failed to like post.',
      });
    }
  }

  protected revealSpoiler(ev?: Event): void {
    // prevent navigation when the whole card is an <a>
    ev?.preventDefault?.();
    ev?.stopPropagation?.();
    this.spoilerRevealed.set(true);
  }

  private async flagPost(): Promise<void> {
    const post = this.post();
    const user = await getFirstNonEmptyValueFrom(this.authService.userChanges);
    const result = await this.postService.flagPost(post.id, user.uid);

    if (result.ok) {
      this.toastService.success({
        message: 'Thanks, your report was received.',
      });
    } else if (result.reason === 'already-flagged') {
      this.unflagPost();
    } else if (result.reason === 'needs-auth') {
      this.toastService.error({
        message: 'Sign in to flag posts.',
      });
    } else {
      this.toastService.error({
        message: 'Failed to flag post.',
      });
    }
  }

  private unflagPost(): void {
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
        message: `You already flagged this post, would you like to unflag it?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldFlag) => {
        if (!shouldFlag) {
          return;
        }

        const post = this.post();
        const user = await getFirstNonEmptyValueFrom(
          this.authService.userChanges,
        );
        const result = await this.postService.unflagPost(post.id, user.uid);
        if (result.ok) {
          this.toastService.success({
            message: 'Post unflagged.',
          });
        } else if (result.reason === 'needs-auth') {
          this.toastService.error({
            message: 'Sign in to unflag posts.',
          });
        } else if (result.reason === 'not-owner') {
          this.toastService.error({
            message: 'You can only unflag your own flags.',
          });
        } else if (result.reason === 'retry-later') {
          this.toastService.error({
            message: 'Network error, please try again later.',
          });
        } else {
          this.toastService.error({
            message: 'Failed to unflag post.',
          });
        }
      });
  }

  private unlikePost(): void {
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
        message: `You already liked this post, do you want to unlike it?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldFlag) => {
        if (!shouldFlag) {
          return;
        }

        const post = this.post();
        const user = await getFirstNonEmptyValueFrom(
          this.authService.userChanges,
        );
        const result = await this.postService.unlikePost(post.id, user.uid);
        if (result.ok) {
          this.toastService.success({
            message: 'Post unliked.',
          });
          // Decrease locally (don’t go below zero)
          this.likesDelta.update((n) => n - 1);
        } else if (result.reason === 'needs-auth') {
          this.toastService.error({
            message: 'Sign in to unlike posts.',
          });
        } else if (result.reason === 'not-owner') {
          this.toastService.error({
            message: 'You can only unlike your own likes.',
          });
        } else if (result.reason === 'retry-later') {
          this.toastService.error({
            message: 'Network error, please try again later.',
          });
        } else {
          this.toastService.error({
            message: 'Failed to unlike post.',
          });
        }
      });
  }
}
