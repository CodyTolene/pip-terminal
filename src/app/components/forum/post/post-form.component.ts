import {
  FormDirective,
  InputCheckboxComponent,
  InputComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { combineLatest, filter, firstValueFrom, map, of } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPostCreate } from 'src/app/models';
import {
  AuthService,
  ForumImageService,
  ForumPostsService,
  MarkupService,
  ToastService,
} from 'src/app/services';
import {
  Validation,
  getEnumValues,
  isNonEmptyString,
  isNonEmptyValue,
  shareSingleReplay,
} from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  ForumPostFormGroup,
  forumPostFormGroup,
} from 'src/app/components/forum/post/post-form-group';
import { Counter } from 'src/app/components/forum/post/quill-counter';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-post-form',
  templateUrl: './post-form.component.html',
  imports: [
    CommonModule,
    InputCheckboxComponent,
    InputComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    MatIcon,
    PipButtonComponent,
    QuillModule,
    ReactiveFormsModule,
  ],
  providers: [],
  styleUrl: './post-form.component.scss',
})
export class PipForumPostFormComponent
  extends FormDirective<ForumPostFormGroup>
  implements OnDestroy
{
  public constructor() {
    super();

    // Set up form, quill, and dynamic validation
    this.formGroup.controls.contentHtml.addValidators(
      Validation.maxVisibleCharsFromHtmlValidator(
        Validation.forum.post.contentHtml.maxLength,
        inject(MarkupService),
        // How many characters an image is "worth" in the count
        this.imageCharacterWeight,
      ),
    );
    this.formGroup.controls.contentHtml.updateValueAndValidity({
      emitEvent: false,
    });
    // Chheck to see if `modules/counter` is already registered
    if (!Quill.imports['modules/counter']) {
      // Register custom module for counting characters
      Quill.register('modules/counter', Counter);
    }
    this.formGroup.reset();

    // Reactive form disabling while submitting
    effect(() => {
      const isSubmitting = this.isSubmitting();
      if (isSubmitting) {
        this.formGroup.controls.category.disable({ emitEvent: false });
        this.formGroup.controls.contentHtml.disable({ emitEvent: false });
        this.formGroup.controls.isSpoiler.disable({ emitEvent: false });
        this.formGroup.controls.title.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.category.enable({ emitEvent: false });
        this.formGroup.controls.contentHtml.enable({ emitEvent: false });
        this.formGroup.controls.isSpoiler.enable({ emitEvent: false });
        this.formGroup.controls.title.enable({ emitEvent: false });
      }
    });
  }

  private readonly authService = inject(AuthService);
  private readonly forumPostsService = inject(ForumPostsService);
  private readonly imageService = inject(ForumImageService);
  private readonly markupService = inject(MarkupService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  protected override readonly formGroup = forumPostFormGroup;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected readonly contentMaxLen =
    Validation.forum.post.contentHtml.maxLength;

  protected readonly imageCharacterWeight = 500;

  private readonly forumLink = '/' + ('forum' satisfies PageUrl);

  protected readonly forumCategoryList = combineLatest([
    this.userChanges.pipe(filter(isNonEmptyValue)),
    of(getEnumValues(ForumCategoryEnum)),
  ]).pipe(
    map(([user, categories]) => {
      if (user.isAdmin) {
        return categories;
      }
      return categories.filter((c) => c !== ForumCategoryEnum.ANNOUNCEMENTS);
    }),
  );

  protected readonly isSubmitting = signal(false);

  protected readonly editorModules = editorModules;

  protected readonly allowedFormats = allowedFormats;

  private detachQuill?: () => void;

  protected async createPost(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.scrollToFirstInvalidControl();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { category, contentHtml, isSpoiler, title } = this.formGroup.value;

      if (!isNonEmptyString(contentHtml)) {
        throw new Error('Content must not be empty!');
      }
      if (!isNonEmptyString(title)) {
        throw new Error('Title must not be empty!');
      }
      if (!isNonEmptyValue(category)) {
        throw new Error('Category must be selected!');
      }
      if (isSpoiler === null || isSpoiler === undefined) {
        throw new Error('isSpoiler must be set!');
      }

      const user = await firstValueFrom(this.userChanges);
      if (!user) {
        throw new Error('User must be logged in to create a post');
      }

      const safeHtml = this.markupService.sanitizeForStorage(contentHtml ?? '');

      const toCreate: ForumPostCreate = {
        authorId: user.uid,
        authorName: user.displayName || user.email,
        category,
        contentHtml: safeHtml,
        isSpoiler,
        title,
      };

      const newPost = await this.forumPostsService.addPost(toCreate);
      if (!newPost) {
        this.toastService.error({
          message: 'Failed to create post. Please try again later.',
          durationSecs: 3,
        });
        this.isSubmitting.set(false);
        return;
      }

      this.toastService.success({
        message: 'Post created successfully!',
        durationSecs: 3,
      });
      this.formGroup.reset();
      this.isSubmitting.set(false);

      const postUrl: PageUrl = 'forum/post/:id';
      const url = '/' + postUrl.replace(':id', newPost.id ?? '');

      try {
        // Navigate to the new post
        await this.router.navigate([url]);
      } catch {
        // Fallback: Navigate to forum main page
        await this.router.navigate([this.forumLink]);
      }
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

  protected onEditorCreated(q: Quill): void {
    // Delegate all image picking/paste/drop handling to the service
    this.detachQuill?.();
    this.detachQuill = this.imageService.attachToQuill(q);
  }

  public ngOnDestroy(): void {
    this.detachQuill?.();
  }
}

const allowedFormats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'header',
  'list',
  'blockquote',
  'code-block',
  'link',
  'image',
  'align',
];

const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    [{ header: [1, 2, 3, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
};
