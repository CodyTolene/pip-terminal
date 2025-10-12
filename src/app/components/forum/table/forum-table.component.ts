import { TableComponent, TableSortChangeEvent } from '@proangular/pro-table';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost } from 'src/app/models';
import { ForumPostsService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Signal,
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
import { LoadingComponent } from 'src/app/components/loading/loading.component';

import { ForumPostPagedResult } from 'src/app/types/forum-post-paged-result';

@Component({
  selector: 'pip-forum-table[category]',
  templateUrl: './forum-table.component.html',
  styleUrl: './forum-table.component.scss',
  imports: [CommonModule, LoadingComponent, MatPaginatorModule, TableComponent],
  providers: [ForumPostsService],
  standalone: true,
})
export class ForumTableComponent implements OnInit {
  @Input({ required: true }) public category!: ForumCategoryEnum;

  @ViewChild('matPaginator', { static: false })
  private readonly paginator!: MatPaginator;

  private readonly forumPostsService = inject(ForumPostsService);
  private readonly router = inject(Router);

  protected readonly columns = signal(forumTableColumns);

  protected initialSort: TableSortChangeEvent<ForumPost> = {
    key: 'createdAt',
    direction: 'desc',
  };

  protected readonly loading = signal(false);

  @HostBinding('class.loading')
  protected get isLoading(): boolean {
    return this.loading();
  }

  protected pageSizeOptions = [5, 10, 15];
  protected pageSizeDefault = this.pageSizeOptions[1]; // 10

  private readonly page = signal<ForumPostPagedResult | null>(null);
  protected readonly posts: Signal<readonly ForumPost[] | null> = computed(
    () => {
      // Make posts() null while loading so the loader shows and paginator hides
      return this.loading() ? null : (this.page()?.posts ?? null);
    },
  );

  private readonly defaultSortKey = 'createdAt' satisfies keyof ForumPost;
  protected readonly currentSort = signal<TableSortChangeEvent<ForumPost>>({
    key: this.defaultSortKey,
    direction: 'desc',
  });
  protected readonly total = signal(0);
  protected readonly pageIndex = signal(0);

  private pageCache = new Map<number, ForumPostPagedResult>();

  public async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [total, first] = await Promise.all([
        this.forumPostsService.getPostsTotal({ category: this.category }),
        this.forumPostsService.getPostsPage({
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
    if (target === this.pageIndex()) {
      return;
    }

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
        const first = await this.forumPostsService.getPostsPage({
          category: this.category,
          pageSize: e.pageSize,
          sort: this.currentSort(),
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
        const last = await this.forumPostsService.getLastPostsPage({
          category: this.category,
          pageSize: e.pageSize,
          sort: this.currentSort(),
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
    if (!current) {
      return;
    }

    this.loading.set(true);
    try {
      const result = await this.forumPostsService.getPostsPage({
        category: this.category,
        pageSize: e.pageSize,
        sort: this.currentSort(),
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
    // Sort didn't change, bail
    if (
      event.key === this.currentSort().key &&
      event.direction === this.currentSort().direction
    ) {
      return;
    }

    const spec: TableSortChangeEvent<ForumPost> = event.direction
      ? event
      : { key: this.defaultSortKey, direction: 'desc' };
    this.currentSort.set(spec);

    const cols = this.columns();
    const headerKey = event.direction
      ? (cols.find((c) => (c.sortKey ?? c.key) === event.key)?.key ??
        event.key ??
        this.defaultSortKey)
      : this.defaultSortKey;

    // Store sort and re-apply after remount
    this.initialSort = { key: headerKey, direction: spec.direction };

    this.pageCache.clear();
    this.pageIndex.set(0);

    this.loading.set(true);
    try {
      const first = await this.forumPostsService.getPostsPage({
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
      const first = await this.forumPostsService.getPostsPage({
        category: this.category,
        pageSize: this.pageSizeDefault,
        sort: this.currentSort(),
      });
      this.page.set(first);
      this.pageCache.set(0, first);
    } finally {
      this.loading.set(false);
    }
  }
}
