/** The dynamic identifier used for resources in routes. */
const id: RouteResourceId = ':id';

const PIP_BOY_3000_MK_IV_PAGE_URLS = [
  'data/quests',
  'data/stats',
  'data/workshops',
  'inv/aid',
  'inv/apparel',
  'inv/weapons',
  'map',
  'radio',
  'stat/perks',
  'stat/special',
  'stat/status',
] as const;

/** All the route URL's for every page. */
export const PAGE_URLS = (
  [
    '', // Home
    '**', // Catch-all
    '2000-mk-vi',
    '3000',
    '3000-mk-iv',
    ...PIP_BOY_3000_MK_IV_PAGE_URLS,
    '3000-mk-v',
    '3000-mk-v/apps',
    '3000-mk-v/maintenance',
    '3000-mk-v/radio',
    '3000a',
    'login',
    'privacy-policy',
    'register',
    'status',
    'terms-and-conditions',
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
