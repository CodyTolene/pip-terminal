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
  inject,
  input,
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

  protected onLikePostClick(): void {
    // console.log('Like post', this.post);
    this.toastService.error({
      message: 'Liking posts is not implemented yet.',
    });
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

          await this.unflagPost();
        });
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

  private async unflagPost(): Promise<void> {
    const post = this.post();
    const user = await getFirstNonEmptyValueFrom(this.authService.userChanges);
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
  }
}
