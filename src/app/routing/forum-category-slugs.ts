import { ForumCategoryEnum } from 'src/app/enums';

export type ForumCategorySlug =
  | 'general'
  | 'pip-boy-2000-mk-vi'
  | 'pip-boy-3000'
  | 'pip-boy-3000a'
  | 'pip-boy-3000-mk-iv'
  | 'pip-boy-3000-mk-v';

export const SLUG_TO_CATEGORY: Record<ForumCategorySlug, ForumCategoryEnum> = {
  general: ForumCategoryEnum.GENERAL,
  'pip-boy-2000-mk-vi': ForumCategoryEnum.PIP_2000_MK_VI,
  'pip-boy-3000': ForumCategoryEnum.PIP_3000,
  'pip-boy-3000a': ForumCategoryEnum.PIP_3000A,
  'pip-boy-3000-mk-iv': ForumCategoryEnum.PIP_3000_MK_IV,
  'pip-boy-3000-mk-v': ForumCategoryEnum.PIP_3000_MK_V,
} as const;

export const CATEGORY_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_CATEGORY).map(([slug, cat]) => [cat, slug]),
) as Record<ForumCategoryEnum, ForumCategorySlug>;
