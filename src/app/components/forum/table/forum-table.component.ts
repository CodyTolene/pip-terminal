import { TableComponent } from '@proangular/pro-table';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost } from 'src/app/models';
import { ForumService, PostPage } from 'src/app/services';

import {
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { forumTableColumns } from 'src/app/components/forum/table/forum-table-columns';

@Component({
  selector: 'pip-forum-table[category]',
  templateUrl: './forum-table.component.html',
  styleUrl: './forum-table.component.scss',
  imports: [TableComponent],
  providers: [ForumService],
  standalone: true,
})
export class ForumTableComponent implements OnInit {
  @Input({ required: true }) public category!: ForumCategoryEnum;

  private readonly forumService = inject(ForumService);
  private readonly router = inject(Router);

  protected readonly columns = signal(forumTableColumns);
  protected readonly loading = signal(false);

  private readonly page = signal<PostPage | null>(null);

  private readonly postsMaxPerPage = 5;

  protected readonly posts = computed(() => this.page()?.posts ?? []);

  public async ngOnInit(): Promise<void> {
    await this.loadFirstPagePosts();
  }

  protected async onRowClick(post: ForumPost): Promise<void> {
    await this.router.navigateByUrl(post.url);
  }

  private async loadFirstPagePosts(): Promise<void> {
    this.loading.set(true);
    try {
      const first = await this.forumService.getPostsPage({
        category: this.category,
        pageSize: this.postsMaxPerPage,
      });
      this.page.set(first);
    } finally {
      this.loading.set(false);
    }
  }
}
