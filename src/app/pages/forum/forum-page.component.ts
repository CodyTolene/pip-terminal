import { PipFooterComponent } from 'src/app/layout';
import { DateTimePipe } from 'src/app/pipes';
import { AuthService, ForumService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-page',
  standalone: true,
  imports: [
    CommonModule,
    DateTimePipe,
    FormsModule,
    PipFooterComponent,
    RouterModule,
  ],
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.scss'],
})
export class ForumPageComponent {
  private readonly authService = inject(AuthService);
  private readonly forumService = inject(ForumService);

  protected readonly forumNewPostLink = forumNewPostLink;
  protected readonly forumPostViewLink = forumPostViewLink;
  protected readonly loginLink = loginLink;
  protected readonly registerLink = registerLink;

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());
  protected readonly postsChanges = this.forumService.getPosts();

  protected getPostViewLink(postId: string): string {
    const forumPostViewLink: PageUrl = 'forum/post/:id';
    return '/' + forumPostViewLink.replace(':id', postId);
  }

  protected getReturnUrlQueryParams(): object {
    return {
      returnUrl: window.location.pathname,
    };
  }
}

const forumNewPostLink = '/' + ('forum/post' satisfies PageUrl);
const forumPostViewLink = '/' + ('forum/post' satisfies PageUrl) + '/';
const loginLink = '/' + ('login' satisfies PageUrl);
const registerLink = '/' + ('register' satisfies PageUrl);
