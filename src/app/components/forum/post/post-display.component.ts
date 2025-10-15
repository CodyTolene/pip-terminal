import { DateTimePipe } from '@proangular/pro-form';
import { ForumPost } from 'src/app/models';
import { AuthService, ToastService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  booleanAttribute,
  inject,
  input,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-post-display[post]',
  templateUrl: './post-display.component.html',
  imports: [CommonModule, DateTimePipe, MatIcon, MatTooltip, RouterModule],
  styleUrl: './post-display.component.scss',
})
export class PipForumPostDisplayComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  @Input({ transform: booleanAttribute })
  public linkedPost = false;

  @Input({ transform: booleanAttribute })
  public simple = false;

  public readonly post = input.required<ForumPost>();

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected onFlagPostClick(): void {
    // TODO: REMOVE
    // eslint-disable-next-line no-console
    console.log('Flag post', this.post);
    this.toastService.error({
      message: 'Flagging posts is not implemented yet.',
    });
  }

  protected onLikePostClick(): void {
    // TODO: REMOVE
    // eslint-disable-next-line no-console
    console.log('Like post', this.post);
    this.toastService.error({
      message: 'Liking posts is not implemented yet.',
    });
  }
}
