import { Subscription, firstValueFrom } from 'rxjs';
import { PipFooterComponent } from 'src/app/layout';
import { DateTimePipe } from 'src/app/pipes';
import { ForumService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ForumComment } from 'src/app/models/forum-comment.model';
import { ForumPost } from 'src/app/models/forum-post.model';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-forum-view-page',
  standalone: true,
  imports: [
    CommonModule,
    DateTimePipe,
    FormsModule,
    PipFooterComponent,
    RouterModule,
  ],
  providers: [ForumService],
  templateUrl: './forum-view-page.component.html',
  styleUrls: ['./forum-view-page.component.scss'],
})
export class ForumViewPageComponent implements OnDestroy {
  public constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPost(id);
      this.subscribeComments(id);
    } else {
      this.loading.set(false);
      this.error.set(true);
    }
  }

  private readonly route = inject(ActivatedRoute);
  private readonly forumService = inject(ForumService);

  protected readonly forumLink = '/' + ('forum' satisfies PageUrl);

  protected readonly comments = signal<readonly ForumComment[]>([]);
  protected readonly error = signal<boolean>(false);
  protected readonly loading = signal<boolean>(true);
  protected readonly post = signal<ForumPost | null>(null);

  private commentsSub: Subscription | null = null;

  private async loadPost(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(false);
    try {
      const post = await firstValueFrom(this.forumService.getPost(id));
      if (!post) {
        throw new Error('Post not found');
      }
      this.post.set(post);
      this.loading.set(false);
    } catch (err) {
      console.error('Failed to load forum post', err);
      this.error.set(true);
      this.loading.set(false);
    }
  }

  private subscribeComments(id: string): void {
    // Clean up any previous subscription
    this.commentsSub?.unsubscribe();
    this.commentsSub = this.forumService
      .getComments(id)
      .subscribe((list) => this.comments.set(list));
  }

  public ngOnDestroy(): void {
    this.commentsSub?.unsubscribe();
  }
}
