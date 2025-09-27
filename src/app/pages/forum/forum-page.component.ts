import { DateTimePipe } from 'src/app/pipes';
import { ForumService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DateTimePipe, RouterModule],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
})
export class ForumPageComponent {
  private readonly forumService = inject(ForumService);

  protected readonly forumPostLink = '/' + ('forum/post' satisfies PageUrl);
  protected readonly postsChanges = this.forumService.getPosts();
}
