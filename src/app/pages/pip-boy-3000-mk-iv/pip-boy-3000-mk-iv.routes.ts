import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { PIP_BOY_3000_MK_IV_AID_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/aid/pip-boy-3000-mk-iv-aid-page.route';
import { PIP_BOY_3000_MK_IV_APPAREL_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/apparel/pip-boy-3000-mk-iv-apparel-page.route';
import { PIP_BOY_3000_MK_IV_MAP_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/map/pip-boy-3000-mk-iv-map-page.route';
import { PIP_BOY_3000_MK_IV_PERKS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/perks/pip-boy-3000-mk-iv-perks-page.route';
import { PIP_BOY_3000_MK_IV_QUESTS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/quests/pip-boy-3000-mk-iv-quests-page.route';
import { PIP_BOY_3000_MK_IV_RADIO_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/radio/pip-boy-3000-mk-iv-radio-page.route';
import { PIP_BOY_3000_MK_IV_SPECIAL_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/special/pip-boy-3000-mk-iv-special-page.route';
import { PIP_BOY_3000_MK_IV_STATS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/stats/pip-boy-3000-mk-iv-stats-page.route';
import { PIP_BOY_3000_MK_IV_STATUS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/status/pip-boy-3000-mk-iv-status-page.route';
import { PIP_BOY_3000_MK_IV_WEAPONS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/weapons/pip-boy-3000-mk-iv-weapons-page.route';
import { PIP_BOY_3000_MK_IV_WORKSHOPS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-iv/workshops/pip-boy-3000-mk-iv-workshops-page.route';

export const PIP_BOY_3000_MK_IV_ROUTES: PipRoute = {
  path: '3000-mk-iv',
  pathMatch: 'prefix',
  data: {
    author: META_AUTHOR,
    description: 'Pip-Boy 3000 Mk IV device simulator!',
    keywords: ['Pip-Boy 3000 Mk IV', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'Pip-Boy 3000 Mk IV Simulator',
  },
  children: [
    // "STAT" Tab:
    PIP_BOY_3000_MK_IV_STATUS_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_SPECIAL_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_PERKS_PAGE_ROUTE,
    // "INV" Tab:
    PIP_BOY_3000_MK_IV_WEAPONS_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_APPAREL_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_AID_PAGE_ROUTE,
    // "DATA" Tab:
    PIP_BOY_3000_MK_IV_QUESTS_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_WORKSHOPS_PAGE_ROUTE,
    PIP_BOY_3000_MK_IV_STATS_PAGE_ROUTE,
    // "MAP" Tab:
    PIP_BOY_3000_MK_IV_MAP_PAGE_ROUTE,
    // "RADIO" Tab:
    PIP_BOY_3000_MK_IV_RADIO_PAGE_ROUTE,
  ],
};
