import { DateTimePipe } from '@proangular/pro-form';
import { ForumPost } from 'src/app/models';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-post-display[post]',
  templateUrl: './post-display.component.html',
  imports: [CommonModule, DateTimePipe, RouterModule],
  styleUrl: './post-display.component.scss',
})
export class PipForumPostDisplayComponent {
  @Input({ required: false, transform: coerceBooleanProperty })
  public linkedPost = false;

  @Input({ required: false, transform: coerceBooleanProperty })
  public simple = false;

  public readonly post = input.required<ForumPost>();
}
