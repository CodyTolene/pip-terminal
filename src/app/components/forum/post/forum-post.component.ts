import { DateTimePipe } from '@proangular/pro-form';
import { ForumPost } from 'src/app/models';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-post[post]',
  templateUrl: './forum-post.component.html',
  imports: [CommonModule, DateTimePipe, RouterModule],
  styleUrl: './forum-post.component.scss',
})
export class PipForumPostComponent {
  @Input({ required: false, transform: coerceBooleanProperty })
  public linkedPost = false;

  @Input({ required: false, transform: coerceBooleanProperty })
  public simple = false;

  public readonly post = input.required<ForumPost>();
}
