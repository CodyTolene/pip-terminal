import { ForumCategoryEnum } from 'src/app/enums';

export type ForumCategorySlug =
  | 'announcements'
  | 'cosplay'
  | 'general'
  | 'pip-boy-2000-mk-vi'
  | 'pip-boy-3000'
  | 'pip-boy-3000-mk-iv'
  | 'pip-boy-3000-mk-v'
  | 'pip-boy-3000a';

export const SLUG_TO_CATEGORY: Record<ForumCategorySlug, ForumCategoryEnum> = {
  announcements: ForumCategoryEnum.ANNOUNCEMENTS,
  cosplay: ForumCategoryEnum.COSPLAY,
  general: ForumCategoryEnum.GENERAL,
  'pip-boy-2000-mk-vi': ForumCategoryEnum.PIP_2000_MK_VI,
  'pip-boy-3000': ForumCategoryEnum.PIP_3000,
  'pip-boy-3000-mk-iv': ForumCategoryEnum.PIP_3000_MK_IV,
  'pip-boy-3000-mk-v': ForumCategoryEnum.PIP_3000_MK_V,
  'pip-boy-3000a': ForumCategoryEnum.PIP_3000A,
} as const;

export const CATEGORY_TO_SLUG = Object.fromEntries(
  Object.entries(SLUG_TO_CATEGORY).map(([slug, cat]) => [cat, slug]),
) as Record<ForumCategoryEnum, ForumCategorySlug>;
