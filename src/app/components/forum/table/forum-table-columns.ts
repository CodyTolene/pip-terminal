import { TableColumn } from '@proangular/pro-table';
import { ForumPost } from 'src/app/models';

const defaultColumn: Partial<TableColumn<ForumPost>> = {
  copyable: false,
  isSortable: true,
  minWidthPx: undefined,
  sortKey: undefined,
};

export const forumTableColumns: ReadonlyArray<TableColumn<ForumPost>> = [
  {
    ...defaultColumn,
    key: 'titlePreview',
    label: 'Title',
    sortKey: 'title' satisfies keyof ForumPost,
  },
  {
    ...defaultColumn,
    key: 'category',
    label: 'Category',
  },
  {
    ...defaultColumn,
    key: 'contentPreview',
    label: 'Preview',
    sortKey: 'content' satisfies keyof ForumPost,
  },
  {
    ...defaultColumn,
    key: 'createdAt',
    label: 'Date',
  },
];
