import { TableColumn } from '@proangular/pro-table';
import { ForumPost } from 'src/app/models';

const defaultColumn: Partial<TableColumn<ForumPost>> = {
  copyable: false,
  isSortable: false,
  minWidthPx: undefined,
  sortKey: undefined,
};

export const forumTableColumns: ReadonlyArray<TableColumn<ForumPost>> = [
  {
    ...defaultColumn,
    key: 'title',
    label: 'Title',
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
  },
  {
    ...defaultColumn,
    key: 'createdAt',
    label: 'Date',
  },
];
