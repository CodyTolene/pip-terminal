import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface CommentFormGroup {
  content: FormControl<string>;
}

export const commentFormGroup = new FormGroup<CommentFormGroup>({
  content: new FormControl<string>('', {
    validators: [
      Validators.required,
      Validators.minLength(Validation.forum.comment.content.minLength),
      Validators.maxLength(Validation.forum.comment.content.maxLength),
    ],
    nonNullable: true,
  }),
});
