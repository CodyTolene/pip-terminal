import {
  FormDirective,
  InputComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
  InputTextareaComponent,
} from '@proangular/pro-form';
import { firstValueFrom } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import { AuthService, ForumPostsService, ToastService } from 'src/app/services';
import {
  getEnumValues,
  isNonEmptyString,
  isNonEmptyValue,
  shareSingleReplay,
} from 'src/app/utilities';

import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  ForumPostFormGroup,
  forumPostFormGroup,
} from 'src/app/components/forum/post/post-form-group';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-post-form',
  templateUrl: './post-form.component.html',
  imports: [
    InputComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    InputTextareaComponent,
    PipButtonComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './post-form.component.scss',
})
export class PipForumPostFormComponent extends FormDirective<ForumPostFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();

    effect(() => {
      const isSubmitting = this.isSubmitting();
      if (isSubmitting) {
        this.formGroup.controls.category.disable({ emitEvent: false });
        this.formGroup.controls.content.disable({ emitEvent: false });
        this.formGroup.controls.title.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.category.enable({ emitEvent: false });
        this.formGroup.controls.content.enable({ emitEvent: false });
        this.formGroup.controls.title.enable({ emitEvent: false });
      }
    });
  }
  private readonly authService = inject(AuthService);
  private readonly forumPostsService = inject(ForumPostsService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected override readonly formGroup = forumPostFormGroup;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  private readonly forumLink = '/' + ('forum' satisfies PageUrl);

  protected readonly forumCategoryList = getEnumValues(ForumCategoryEnum);

  protected readonly isSubmitting = signal(false);

  protected async createPost(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { category, content, title } = this.formGroup.value;
      if (!isNonEmptyString(content)) {
        throw new Error('Content must not be empty!');
      } else if (!isNonEmptyString(title)) {
        throw new Error('Title must not be empty!');
      } else if (!isNonEmptyValue(category)) {
        throw new Error('Category must be selected!');
      }

      const user = await firstValueFrom(this.userChanges);

      if (!user || user === null) {
        throw new Error('User must be logged in to create a post');
      }

      await this.forumPostsService.addPost({
        authorId: user.uid,
        authorName: user.displayName || user.email,
        category,
        content,
        title,
      });
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
