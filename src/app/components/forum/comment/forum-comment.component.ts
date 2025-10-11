import { DateTimePipe } from '@proangular/pro-form';
import { ForumComment } from 'src/app/models';

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-forum-comment[comment]',
  templateUrl: './forum-comment.component.html',
  imports: [CommonModule, DateTimePipe, RouterModule],
  styleUrl: './forum-comment.component.scss',
})
export class PipForumCommentComponent {
  public readonly comment = input.required<ForumComment>();
}
