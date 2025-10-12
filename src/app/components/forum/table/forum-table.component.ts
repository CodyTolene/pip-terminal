import { TableComponent, TableSortChangeEvent } from '@proangular/pro-table';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost } from 'src/app/models';
import { ForumService, PostPage, SortSpec } from 'src/app/services';

import {
  Component,
  Input,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Router } from '@angular/router';

import { forumTableColumns } from 'src/app/components/forum/table/forum-table-columns';

@Component({
  selector: 'pip-forum-table[category]',
  templateUrl: './forum-table.component.html',
  styleUrl: './forum-table.component.scss',
  imports: [MatPaginatorModule, TableComponent],
  providers: [ForumService],
  standalone: true,
})
export class ForumTableComponent implements OnInit {
  @Input({ required: true }) public category!: ForumCategoryEnum;

  @ViewChild('matPaginator', { static: false })
  private readonly paginator!: MatPaginator;

  private readonly forumService = inject(ForumService);
  private readonly router = inject(Router);

  protected readonly columns = signal(forumTableColumns);
  protected readonly loading = signal(false);

  protected pageSizeOptions = [5, 10, 15];
  protected pageSizeDefault = this.pageSizeOptions[1]; // 10

  private readonly page = signal<PostPage | null>(null);
  protected readonly posts = computed(() => this.page()?.posts ?? []);

  private readonly defaultSortKey = 'createdAt' satisfies keyof ForumPost;
  protected readonly currentSort = signal<SortSpec>({
    field: this.defaultSortKey,
    direction: 'desc',
  });
  protected readonly total = signal(0);
  protected readonly pageIndex = signal(0);

  private pageCache = new Map<number, PostPage>();

  public async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [total, first] = await Promise.all([
        this.forumService.getPostsTotal({ category: this.category }),
        this.forumService.getPostsPage({
          category: this.category,
          pageSize: this.pageSizeDefault,
          sort: this.currentSort(),
        }),
      ]);
      this.total.set(total);
      this.page.set(first);
      this.pageCache.set(0, first);
      this.pageIndex.set(0);
    } finally {
      this.loading.set(false);
    }
  }

  protected async onPaginate(e: PageEvent): Promise<void> {
    // page size changed resets to first
    if (e.pageSize !== this.pageSizeDefault) {
      this.pageSizeDefault = e.pageSize;
      this.pageCache.clear();
      await this.reloadFirstPage();
      this.pageIndex.set(0);
      return;
    }

    const lastIndex = Math.max(0, Math.ceil(this.total() / e.pageSize) - 1);
    const target = Math.min(Math.max(0, e.pageIndex), lastIndex);
    if (target === this.pageIndex()) return;

    // cache hit
    const cached = this.pageCache.get(target);
    if (cached) {
      this.page.set(cached);
      this.pageIndex.set(target);
      return;
    }

    // First page
    if (target === 0) {
      this.loading.set(true);
      try {
        const first = await this.forumService.getPostsPage({
          category: this.category,
          pageSize: e.pageSize,
        });
        this.page.set(first);
        this.pageCache.set(0, first);
        this.pageIndex.set(0);
      } finally {
        this.loading.set(false);
      }
      return;
    }

    // Last page
    if (target === lastIndex) {
      this.loading.set(true);
      try {
        const last = await this.forumService.getLastPostsPage({
          category: this.category,
          pageSize: e.pageSize,
        });
        this.page.set(last);
        this.pageCache.set(lastIndex, last);
        this.pageIndex.set(lastIndex);
      } finally {
        this.loading.set(false);
      }
      return;
    }

    // Adjacent next or prev
    const goingNext = target > this.pageIndex();
    const current = this.page();
    if (!current) return;

    this.loading.set(true);
    try {
      const result = await this.forumService.getPostsPage({
        category: this.category,
        pageSize: e.pageSize,
        lastDoc: goingNext ? current.lastDoc : undefined,
        firstDoc: goingNext ? undefined : current.firstDoc,
      });
      this.page.set(result);
      this.pageCache.set(target, result);
      this.pageIndex.set(target);
    } finally {
      this.loading.set(false);
    }
  }

  protected async onRowClick(post: ForumPost): Promise<void> {
    await this.router.navigateByUrl(post.url);
  }

  protected async onSortChange(
    event: TableSortChangeEvent<ForumPost>,
  ): Promise<void> {
    const spec: SortSpec = event.direction
      ? this.toSortSpec(event)
      : { field: this.defaultSortKey, direction: 'desc' };
    this.currentSort.set(spec);

    // reset pagination and cache on sort change
    this.pageCache.clear();
    this.pageIndex.set(0);

    this.loading.set(true);
    try {
      const first = await this.forumService.getPostsPage({
        category: this.category,
        pageSize: this.pageSizeDefault,
        sort: spec,
      });
      this.page.set(first);
      this.pageCache.set(0, first);
    } finally {
      this.loading.set(false);
    }
  }

  private async reloadFirstPage(): Promise<void> {
    this.loading.set(true);
    try {
      const first = await this.forumService.getPostsPage({
        category: this.category,
        pageSize: this.pageSizeDefault,
      });
      this.page.set(first);
      this.pageCache.set(0, first);
    } finally {
      this.loading.set(false);
    }
  }

  private toSortSpec(e: TableSortChangeEvent<ForumPost>): SortSpec {
    const field = (e.key ?? this.defaultSortKey) as keyof ForumPost;
    const direction =
      e.direction === 'asc' || e.direction === 'desc' ? e.direction : 'desc';
    return { field, direction };
  }
}
