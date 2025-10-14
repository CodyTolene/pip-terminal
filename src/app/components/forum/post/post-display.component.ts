import { DateTimePipe } from '@proangular/pro-form';
import { ForumPost } from 'src/app/models';

import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-post-display[post]',
  templateUrl: './post-display.component.html',
  imports: [CommonModule, DateTimePipe, RouterModule],
  styleUrl: './post-display.component.scss',
})
export class PipForumPostDisplayComponent {
  @Input({ transform: booleanAttribute })
  public linkedPost = false;

  @Input({ transform: booleanAttribute })
  public simple = false;

  public readonly post = input.required<ForumPost>();
}
