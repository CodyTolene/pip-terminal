import {
  FormDirective,
  InputComponent,
  InputTextareaComponent,
} from '@proangular/pro-form';
import { firstValueFrom } from 'rxjs';
import {
  ForumPostFormGroup,
  forumPostFormGroup,
} from 'src/app/pages/forum/post/forum-post-form-group';
import { AuthService, ForumService, ToastService } from 'src/app/services';
import { isNonEmptyString, shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-post-page',
  standalone: true,
  imports: [
    PipButtonComponent,
    CommonModule,
    FormsModule,
    InputComponent,
    InputTextareaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forum-post-page.component.html',
  styleUrls: ['./forum-post-page.component.scss'],
})
export class ForumPostPageComponent extends FormDirective<ForumPostFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();

    effect(() => {
      const isSubmitting = this.isSubmitting();
      if (isSubmitting) {
        this.formGroup.controls.content.disable({ emitEvent: false });
        this.formGroup.controls.title.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.content.enable({ emitEvent: false });
        this.formGroup.controls.title.enable({ emitEvent: false });
      }
    });
  }

  private readonly authService = inject(AuthService);
  private readonly forumLink = '/' + ('forum' satisfies PageUrl);
  private readonly forumService = inject(ForumService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected override readonly formGroup = forumPostFormGroup;

  protected readonly isSubmitting = signal(false);
  private readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected async createPost(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { content, title } = this.formGroup.value;
      if (!isNonEmptyString(content)) {
        throw new Error('Content must not be empty!');
      } else if (!isNonEmptyString(title)) {
        throw new Error('Title must not be empty!');
      }

      const user = await firstValueFrom(this.userChanges);

      await this.forumService.addPost(title, content, user);
      this.toastService.success({
        message: 'Post created successfully!',
        durationSecs: 3,
      });
      this.formGroup.reset();
      this.isSubmitting.set(false);
      await this.router.navigate([this.forumLink]);
    } catch (e) {
      console.error('Failed to create post:', e);
      this.toastService.error({
        message: 'Failed to create post. Please try again later.',
        durationSecs: 3,
      });
      this.isSubmitting.set(false);
    }
  }

  protected async cancel(): Promise<void> {
    await this.router.navigate([this.forumLink]);
  }
}
