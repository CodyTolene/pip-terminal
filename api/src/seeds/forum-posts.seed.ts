import { ForumPostApi } from '../models';

function makeString(length: number, char = 'A'): string {
  return char.repeat(length);
}

export const FORUM_POSTS_SEED: Array<ForumPostApi<unknown>> = [
  // General post 1: exactly at max length
  {
    id: 'general-1',
    authorId: 'user-general-1',
    authorName: 'TestUserMax',
    category: 'General',
    title: makeString(256, 'T'), // max title length
    content: makeString(4096, 'C'), // max content length
    contentDelta: { ops: [] },
    contentHtml: '<p>' + makeString(4096, 'C') + '</p>',
    createdAt: { seconds: 1718000000, nanoseconds: 0 },
  },
  // General post 2: 1 character past max length
  {
    id: 'general-2',
    authorId: 'user-general-2',
    authorName: 'TestUserPast',
    category: 'General',
    title: makeString(257, 'T'), // max + 1
    content: makeString(4097, 'C'), // max + 1
    contentDelta: { ops: [] },
    contentHtml: '<p>' + makeString(4097, 'C') + '</p>',
    createdAt: { seconds: 1718000100, nanoseconds: 0 },
  },
  // General posts 3–50: normal samples
  ...Array.from({ length: 48 }).map((_, i) => ({
    id: `general-${i + 3}`,
    authorId: `user-general-${i + 3}`,
    authorName: `GeneralUser${i + 3}`,
    category: 'General' as const,
    title: `General Discussion ${i + 3}`,
    content: `This is sample content for General Discussion post #${i + 3}.`,
    contentDelta: { ops: [] },
    contentHtml: `<p>This is sample content for General Discussion post #${i + 3}.</p>`,
    createdAt: { seconds: 1718000200 + i * 100, nanoseconds: 0 },
  })),
  // Other categories (just one of each)
  {
    id: 'post-2',
    authorId: 'user-2',
    authorName: 'TechEngineer',
    category: 'Pip-Boy 2000 Mk VI',
    title: 'Repair Tips for Mk VI',
    content: 'Here are some steps I used to replace the screen on my Mk VI.',
    contentDelta: { ops: [] },
    contentHtml:
      '<p>Here are some steps I used to replace the screen on my Mk VI.</p>',
    createdAt: { seconds: 1717300000, nanoseconds: 0 },
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    authorName: 'CollectorJoe',
    category: 'Pip-Boy 3000 Mk IV',
    title: 'Mk IV Rarity',
    content: 'How rare is the 3000 Mk IV compared to later models?',
    contentDelta: { ops: [] },
    contentHtml: '<p>How rare is the 3000 Mk IV compared to later models?</p>',
    createdAt: { seconds: 1717400000, nanoseconds: 0 },
  },
  {
    id: 'post-4',
    authorId: 'user-4',
    authorName: 'Cody',
    category: 'Pip-Boy 3000 Mk V',
    title: 'Custom Firmware Development',
    content: 'Working on Espruino firmware mods for the Mk V. Join in!',
    contentDelta: { ops: [] },
    contentHtml:
      '<p>Working on Espruino firmware mods for the Mk V. Join in!</p>',
    createdAt: { seconds: 1717500000, nanoseconds: 0 },
  },
  {
    id: 'post-5',
    authorId: 'user-5',
    authorName: 'Vault Historian',
    category: 'Pip-Boy 3000',
    title: 'Original 3000 Documentation',
    content: 'Scanned copies of early Pip-Boy 3000 manuals now available.',
    contentDelta: { ops: [] },
    contentHtml:
      '<p>Scanned copies of early Pip-Boy 3000 manuals now available.</p>',
    createdAt: { seconds: 1717600000, nanoseconds: 0 },
  },
  {
    id: 'post-6',
    authorId: 'user-6',
    authorName: 'EngineerBeth',
    category: 'Pip-Boy 3000A',
    title: 'Differences in 3000A Model',
    content: "The 3000A has subtle hardware changes. Let's compare notes.",
    contentDelta: { ops: [] },
    contentHtml:
      "<p>The 3000A has subtle hardware changes. Let's compare notes.</p>",
    createdAt: { seconds: 1717700000, nanoseconds: 0 },
  },
];
