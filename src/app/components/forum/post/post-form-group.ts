import { ForumCategoryEnum } from 'src/app/enums';
import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ForumPostFormGroup {
  category: FormControl<ForumCategoryEnum | null>;
  contentHtml: FormControl<string | null>;
  isSpoiler: FormControl<boolean>;
  title: FormControl<string | null>;
}

export const forumPostFormGroup = new FormGroup<ForumPostFormGroup>({
  category: new FormControl<ForumCategoryEnum | null>(null, {
    validators: [Validators.required],
    nonNullable: true,
  }),
  contentHtml: new FormControl<string | null>(null, {
    validators: [
      Validators.required,
      Validators.minLength(Validation.forum.post.contentHtml.minLength),
      Validators.maxLength(Validation.forum.post.contentHtml.maxLength),
    ],
    nonNullable: true,
  }),
  isSpoiler: new FormControl<boolean>(false, { nonNullable: true }),
  title: new FormControl<string | null>(null, {
    validators: [
      Validators.required,
      Validators.minLength(Validation.forum.post.title.minLength),
      Validators.maxLength(Validation.forum.post.title.maxLength),
    ],
    nonNullable: true,
  }),
});
