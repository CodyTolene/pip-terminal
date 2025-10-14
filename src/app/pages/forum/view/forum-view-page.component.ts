import { firstValueFrom } from 'rxjs';
import { PipFooterComponent } from 'src/app/layout';
import { ForumComment } from 'src/app/models';
import { AuthService, ForumPostsService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipCommentFormComponent } from 'src/app/components/forum/comment/comment-form.component';
import { PipCommentWallComponent } from 'src/app/components/forum/comment/comment-wall.component';
import { ForumHeaderComponent } from 'src/app/components/forum/header/forum-header.component';
import { PipForumPostComponent } from 'src/app/components/forum/post/forum-post.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForumPost } from 'src/app/models/forum-post.model';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-view-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ForumHeaderComponent,
    LoadingComponent,
    MatIcon,
    PipButtonComponent,
    PipCommentFormComponent,
    PipCommentWallComponent,
    PipFooterComponent,
    PipForumPostComponent,
    PipPanelComponent,
    PipTitleComponent,
    RouterModule,
  ],
  providers: [ForumPostsService],
  templateUrl: './forum-view-page.component.html',
  styleUrls: ['./forum-view-page.component.scss'],
})
export class ForumViewPageComponent {
  public constructor() {
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    } else {
      this.loading.set(false);
      this.error.set(true);
    }
  }

  private readonly authService = inject(AuthService);
  private readonly forumPostsService = inject(ForumPostsService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild(PipCommentWallComponent)
  protected commentWallComponent!: PipCommentWallComponent;

  protected readonly forumLink = forumLink;
  protected readonly loginLink = loginLink;

  protected readonly error = signal<boolean>(false);
  protected readonly isReplying = signal(false);
  protected readonly loading = signal<boolean>(true);

  protected readonly post = signal<ForumPost | null>(null);

  protected readonly userChanges =
    this.authService.userChanges.pipe(shareSingleReplay());

  protected getReturnUrlQueryParams(): object {
    return { returnUrl: window.location.pathname };
  }

  protected async onCloseCommentForm(
    newComment: ForumComment | null,
  ): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('New comment:', newComment);

    if (newComment && this.post()) {
      await this.commentWallComponent.reload();
    }

    this.isReplying.set(false);
  }

  private async loadPost(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const post = await firstValueFrom(this.forumPostsService.getPost(id));
      if (!post) throw new Error('Post not found');
      this.post.set(post);
      this.loading.set(false);
    } catch (err) {
      console.error('Failed to load forum post', err);
      this.error.set(true);
      this.loading.set(false);
    }
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
const loginLink = '/' + ('login' satisfies PageUrl);
