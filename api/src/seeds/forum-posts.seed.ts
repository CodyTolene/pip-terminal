import { ForumPostApi } from '../models';

function makeString(length: number, char = 'A'): string {
  return char.repeat(length);
}

export const FORUM_POSTS_SEED: readonly ForumPostApi[] = [
  // General post 1: exactly at max length
  {
    authorId: 'user-general-1',
    authorName: 'TestUserMax',
    category: 'General',
    contentHtml: '<p>' + makeString(4096 - 7, 'C') + '</p>', // max content length
    createdAt: { nanoseconds: 0, seconds: 1718000000, type: undefined },
    flagsCount: 0,
    id: 'general-1',
    isSpoiler: false,
    likesCount: 0,
    title: makeString(256, 'T'), // max title length
  },
  // General post 2: 1 character past max length
  {
    authorId: 'user-general-2',
    authorName: 'TestUserPast',
    category: 'General',
    contentHtml: '<p>' + makeString(4096 - 7, 'C') + '</p>', // max content length
    createdAt: { nanoseconds: 0, seconds: 1718000100 },
    flagsCount: 0,
    id: 'general-2',
    isSpoiler: false,
    likesCount: 0,
    title: makeString(257, 'T'), // max + 1
  },
  // General posts 3–50: normal samples
  ...Array.from({ length: 48 }).map((_, i) => ({
    authorId: `user-general-${i + 3}`,
    authorName: `GeneralUser${i + 3}`,
    category: 'General' as const,
    contentHtml: `<p>This is sample content for General Discussion post #${i + 3}.</p>`,
    createdAt: {
      nanoseconds: 0,
      seconds: 1718000200 + i * 100,
      type: undefined,
    },
    flagsCount: 0,
    id: `general-${i + 3}`,
    isSpoiler: false,
    likesCount: 0,
    title: `General Discussion ${i + 3}`,
  })),
  // Other categories (just one of each)
  {
    authorId: 'user-2',
    authorName: 'TechEngineer',
    category: 'Pip-Boy 2000 Mk VI',
    contentHtml:
      '<p>Here are some steps I used to replace the screen on my Mk VI.</p>',
    createdAt: { nanoseconds: 0, seconds: 1717300000 },
    flagsCount: 0,
    id: 'post-2',
    isSpoiler: false,
    likesCount: 0,
    title: 'Repair Tips for Mk VI',
  },
  {
    authorId: 'user-3',
    authorName: 'CollectorJoe',
    category: 'Pip-Boy 3000 Mk IV',
    contentHtml: '<p>How rare is the 3000 Mk IV compared to later models?</p>',
    createdAt: { nanoseconds: 0, seconds: 1717400000 },
    flagsCount: 0,
    id: 'post-3',
    isSpoiler: false,
    likesCount: 0,
    title: 'Mk IV Rarity',
  },
  {
    authorId: 'user-4',
    authorName: 'Cody',
    category: 'Pip-Boy 3000 Mk V',
    contentHtml:
      '<p>Working on Espruino firmware mods for the Mk V. Join in!</p>',
    createdAt: { nanoseconds: 0, seconds: 1717500000 },
    flagsCount: 0,
    id: 'post-4',
    isSpoiler: false,
    likesCount: 0,
    title: 'Custom Firmware Development',
  },
  {
    authorId: 'user-5',
    authorName: 'Vault Historian',
    category: 'Pip-Boy 3000',
    contentHtml:
      '<p>Scanned copies of early Pip-Boy 3000 manuals now available.</p>',
    createdAt: { nanoseconds: 0, seconds: 1717600000 },
    flagsCount: 0,
    id: 'post-5',
    isSpoiler: false,
    likesCount: 0,
    title: 'Original 3000 Documentation',
  },
  {
    authorId: 'user-6',
    authorName: 'EngineerBeth',
    category: 'Pip-Boy 3000A',
    contentHtml:
      "<p>The 3000A has subtle hardware changes. Let's compare notes.</p>",
    createdAt: { nanoseconds: 0, seconds: 1717700000 },
    flagsCount: 0,
    id: 'post-6',
    isSpoiler: false,
    likesCount: 0,
    title: 'Differences in 3000A Model',
  },
  {
    // This author will be missing (to simulate a deleted user)
    authorId: 'Zbscpis1C7n5y0Ilkce72szvFGeo',
    authorName: 'Deleted_User',
    category: 'Pip-Boy 2000 Mk VI',
    contentHtml:
      '<p>Regular&nbsp;text</p><p>---</p><h3>Heading&nbsp;3</h3><p>---</p><h2>Heading&nbsp;2</h2><p>---</p><h1>Heading&nbsp;1</h1><p>---</p><p><strong>Bold&nbsp;text</strong></p><p>---</p><p><em>Italic&nbsp;text</em></p><p>---</p><p><u>Underlined&nbsp;text</u></p><p>---</p><p><s>Strikethrough&nbsp;text</s></p><p>---</p><p>Numbered&nbsp;list:</p><ol><li>Numbered&nbsp;item&nbsp;one</li><li>Numbered&nbsp;item&nbsp;two</li></ol><p>---</p><p>Bulleted&nbsp;list:</p><ul><li>Bulleted&nbsp;item&nbsp;one</li><li>Bulleted&nbsp;item&nbsp;two</li></ul><p>---</p><blockquote>Quoted&nbsp;text</blockquote><p>---</p><pre data-language="plain">\n&lt;div&gt;DIV CODE BLOCK TEXT&lt;/div&gt;\n</pre><p>---</p><p>Link&nbsp;to&nbsp;<a href="www.google.com" rel="noopener noreferrer" target="_blank">Google.com</a></p><p>---</p><p>Text&nbsp;align&nbsp;left</p><p class="ql-align-center">Text&nbsp;align&nbsp;center</p><p class="ql-align-right">Text&nbsp;align&nbsp;right</p>',
    createdAt: {
      nanoseconds: 601000000,
      seconds: 1760484067,
      type: 'firestore/timestamp/1.0',
    },
    flagsCount: 0,
    id: 'JJIRCIkmfSPjHpLECxyJ',
    isSpoiler: false,
    likesCount: 0,
    title:
      'This is a new post with the WYSIWYG editor!This is a new post with the WYSIWYG editor!This is a new post with the WYSIWYG editor!This is a new post with the WYSIWYG editor!This is a new post with the WYSIWYG editor!This is a new post with the WYSIWYG edito',
  },
  // This is a post that is highly flagged (to test moderation views)
  {
    authorId: 'user-flagged',
    authorName: 'ControversialUser',
    category: 'General',
    contentHtml: '<p>This post has been flagged multiple times.</p>',
    createdAt: { nanoseconds: 0, seconds: 1718005000 },
    flagsCount: 101,
    id: 'general-flagged',
    isSpoiler: false,
    likesCount: 0,
    title: 'Controversial Opinions',
  },
  // This is a highly liked post (to test sorting by likes)
  {
    authorId: 'user-popular',
    authorName: 'PopularUser',
    category: 'General',
    contentHtml: '<p>This post is very popular and has many likes!</p>',
    createdAt: { nanoseconds: 0, seconds: 1718006000 },
    flagsCount: 0,
    id: 'general-popular',
    isSpoiler: false,
    likesCount: 250,
    title: 'Most Liked Post',
  },
  // This post is marked as a spoiler
  {
    authorId: 'user-spoiler',
    authorName: 'SpoilerAlert',
    category: 'General',
    contentHtml: '<p>This post contains spoilers about upcoming releases.</p>',
    createdAt: { nanoseconds: 0, seconds: 1718007000 },
    flagsCount: 0,
    id: 'general-spoiler',
    isSpoiler: true,
    likesCount: 5,
    title: 'Spoilers Ahead!',
  },
];
