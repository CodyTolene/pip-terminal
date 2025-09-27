/**
 * The dynamic resource identifier for a route.
 *
 * @example
 * const id: RouteResourceId = ':id';
 * const resourceUrl = `https://.../resource/${id}`;
 */
type RouteResourceId = ':id';

/** The dynamic identifier used for resources in routes. */
const id: RouteResourceId = ':id';

/** All the route URL's for every page. */
export const PAGE_URLS = (
  [
    '', // Home
    '**', // Catch-all
    '2000-mk-vi',
    '3000',
    '3000-mk-iv',
    '3000-mk-iv/data/quests',
    '3000-mk-iv/data/stats',
    '3000-mk-iv/data/workshops',
    '3000-mk-iv/inv/aid',
    '3000-mk-iv/inv/apparel',
    '3000-mk-iv/inv/weapons',
    '3000-mk-iv/map',
    '3000-mk-iv/radio',
    '3000-mk-iv/stat/perks',
    '3000-mk-iv/stat/special',
    '3000-mk-iv/stat/status',
    '3000-mk-v',
    '3000-mk-v/apps',
    '3000-mk-v/maintenance',
    '3000-mk-v/radio',
    '3000a',
    'forum',
    'forum/post',
    `forum/post/${id}`,
    'login',
    'privacy-policy',
    'register',
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
