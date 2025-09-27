import { DateTime } from 'luxon';
import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ForumPostFormGroup {
  content: FormControl<DateTime | null>;
  title: FormControl<string | null>;
}

export const forumPostFormGroup = new FormGroup<ForumPostFormGroup>({
  content: new FormControl<DateTime | null>(null, {
    validators: [
      Validators.required,
      Validators.minLength(Validation.forum.post.content.minLength),
      Validators.maxLength(Validation.forum.post.content.maxLength),
    ],
    nonNullable: true,
  }),
  title: new FormControl<string | null>(null, {
    validators: [
      Validators.required,
      Validators.minLength(Validation.forum.post.title.minLength),
      Validators.maxLength(Validation.forum.post.title.maxLength),
    ],
    nonNullable: true,
  }),
});
