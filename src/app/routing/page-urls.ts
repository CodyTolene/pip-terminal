/**
 * The dynamic resource identifier for a route.
 *
 * @example
 * const id: RouteResourceId = ':id';
 * const resourceUrl = `https://.../resource/${id}`;
 */
export type RouteResourceId = ':id';

/** The dynamic identifier used for resources in routes. */
const id: RouteResourceId = ':id';

/** All the route URL's for every page. */
export const PAGE_URLS = (
  [
    '', // Home
    '**', // Catch-all
    '2000-mk-vi',
    '3000',
    '3000-companion',
    '3000-mk-iv',
    '3000-mk-v',
    '3000-mk-v/apps',
    '3000-mk-v/cfw-builder',
    '3000-mk-v/file-management',
    '3000-mk-v/maintenance',
    '3000-mk-v/radio',
    '3000-mk-v/update',
    '3000a',
    'forgot-password',
    'forum',
    `forum/category/${id}`,
    'forum/post',
    `forum/post/${id}`,
    'login',
    'privacy-policy',
    'register',
    'resources',
    'status',
    'support',
    'terms-and-conditions',
    'verify-email',
    `vault/${id}`,
  ] as const
)
  // Validate URLs.
  .map((route) => {
    // Disallow urls beginning with a slash
    if (route.startsWith('/')) {
      throw new Error(`The URL "${route}" cannot start with a slash.`);
    }
    return route;
  });

// Public URLs that should appear in the public sitemap.
export const PUBLIC_SITEMAP_URLS: ReadonlyArray<(typeof PAGE_URLS)[number]> = [
  '', // Home
  '2000-mk-vi',
  '3000',
  '3000-companion',
  '3000-mk-iv',
  '3000-mk-v',
  '3000-mk-v/apps',
  '3000-mk-v/cfw-builder',
  '3000-mk-v/file-management',
  '3000-mk-v/maintenance',
  '3000-mk-v/radio',
  '3000-mk-v/update',
  '3000a',
  'forgot-password',
  'forum',
  `forum/category/${id}`,
  'forum/post',
  `forum/post/${id}`,
  'login',
  'privacy-policy',
  'register',
  'resources',
  'status',
  'support',
  'terms-and-conditions',
];

// Internal only URLs that should not appear in the public sitemap.
export const PRIVATE_SITEMAP_URLS: ReadonlyArray<(typeof PAGE_URLS)[number]> = [
  `vault/${id}`,
  'verify-email',
];
