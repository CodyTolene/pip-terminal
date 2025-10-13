import { FormDirective, InputTextareaComponent } from '@proangular/pro-form';
import { firstValueFrom } from 'rxjs';
import { ForumComment, ForumPost } from 'src/app/models';
import {
  AuthService,
  ForumCommentsService,
  ToastService,
} from 'src/app/services';
import { isNonEmptyString, shareSingleReplay } from 'src/app/utilities';

import {
  Component,
  EventEmitter,
  Input,
  Output,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  CommentFormGroup,
  commentFormGroup,
} from 'src/app/components/comment-form/comment-form-group';

@Component({
  selector: 'pip-comment-form',
  templateUrl: './comment-form.component.html',
  imports: [PipButtonComponent, InputTextareaComponent, ReactiveFormsModule],
  styleUrl: './comment-form.component.scss',
  providers: [ForumCommentsService],
  standalone: true,
})
export class PipCommentFormComponent extends FormDirective<CommentFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();

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
  private readonly toastService = inject(ToastService);

  @Input({ required: true }) public post!: ForumPost;

  protected override readonly formGroup = commentFormGroup;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected readonly isSubmitting = signal(false);

  @Output() public readonly closeForm = new EventEmitter<ForumComment | null>();

  protected cancelComment(): void {
    if (this.isSubmitting()) return;
    this.formGroup.reset();
    this.closeForm.emit(null);
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

      if (!this.post) {
        console.error('Post must be loaded to submit a comment');
        return;
      }

      const newComment = await this.forumCommentsService.addComment({
        authorId: user.uid,
        authorName: user.displayName || user.email,
        content,
        postId: this.post.id,
      });

      if (!newComment) {
        this.toastService.error({
          message: 'Failed to submit comment. Please try again later.',
          durationSecs: 3,
        });
        this.isSubmitting.set(false);
      }

      this.toastService.success({
        message: 'Comment added successfully!',
        durationSecs: 3,
      });

      this.formGroup.controls.content.setValue('', { emitEvent: false });
      this.formGroup.controls.content.markAsPristine({ emitEvent: false });
      this.formGroup.controls.content.markAsUntouched({ emitEvent: false });

      this.isSubmitting.set(false);
      this.closeForm.emit(newComment);
    } catch (e) {
      console.error('Failed to create comment:', e);
      this.toastService.error({
        message: 'Failed to submit comment. Please try again later.',
        durationSecs: 3,
      });
      this.isSubmitting.set(false);
    }
  }
}
