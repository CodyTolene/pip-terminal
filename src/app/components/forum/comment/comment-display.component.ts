import { DateTimePipe } from '@proangular/pro-form';
import { ForumComment } from 'src/app/models';

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-comment-display[comment]',
  templateUrl: './comment-display.component.html',
  imports: [CommonModule, DateTimePipe, RouterModule],
  styleUrl: './comment-display.component.scss',
})
export class PipForumCommentDisplayComponent {
  public readonly comment = input.required<ForumComment>();
}
