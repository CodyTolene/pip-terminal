import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-resources-page',
  templateUrl: './resources-page.html',
  imports: [CommonModule, PipFooterComponent, PipTitleComponent],
  styleUrl: './resources-page.scss',
  standalone: true,
})
export class ResourcesPage {
  public readonly resourceGroups = resourceGroups;
}

interface ResourceGroup {
  title: string;
  links: readonly ResourceLink[];
}

interface ResourceLink {
  name: string;
  description: string;
  link: {
    href: string;
    label: string;
  };
}

const resourceGroups: readonly ResourceGroup[] = [
  {
    title: 'The Wand Company',
    links: [
      {
        name: 'Fallout TV Series Pip-Boy',
        description:
          "Official product page for the Wand Company's Pip-Boy 3000 Mk V replica for the Fallout TV series.",
        link: {
          href: 'https://www.thewandcompany.com/fallout-pip-boy/',
          label: 'thewandcompany.com',
        },
      },
      {
        name: 'Fallout 3/NV Pip-Boy 3000',
        description:
          "Official product page for the Wand Company's Pip-Boy 3000 replica for Fallout 3 and Fallout: New Vegas.",
        link: {
          href: 'https://www.thewandcompany.com/pip-boy-3000/',
          label: 'thewandcompany.com',
        },
      },
      {
        name: 'Pip-Boy 3000 Mk V Manual',
        description:
          'Official manual detailing operation, charging, controls, FM radio, alarms, care, troubleshooting, and more.',
        link: {
          href: 'https://www.thewandcompany.com/pip-boy-manual/',
          label: 'thewandcompany.com',
        },
      },
      {
        name: 'Pip-Boy 3000 Mk V Upgrade Tool',
        description:
          'Official Web Serial upgrade page to install latest firmware.',
        link: {
          href: 'https://www.thewandcompany.com/pip-boy/upgrade/',
          label: 'thewandcompany.com',
        },
      },
      {
        name: 'Pip-Boy 3000 Mk V Reset Tool',
        description:
          'Erase and reformat the internal SD card, re-uploads files, and reinstall the Pip-OS firmware.',
        link: {
          href: 'https://www.thewandcompany.com/pip-boy/upgrade/?erase',
          label: 'thewandcompany.com',
        },
      },
      {
        name: 'Pip-Boy 3000 Mk V Support',
        description:
          'Official support section with Pip-Boy troubleshooting articles, upgrade help, error message help, etc.',
        link: {
          href: 'https://thewandcompany.zendesk.com/hc/en-us/sections/35977957884820-I-need-help-with-my-Pip-Boy',
          label: 'thewandcompany.com',
        },
      },
    ],
  },
  {
    title: 'Community Tools & Hubs',
    links: [
      {
        name: 'Pip-Boy Audio Converter',
        description:
          'Convert audio to Pip-Boy compatible format for clean playback.',
        link: {
          href: 'https://xn--wxa.guru/software/pip-boy/audio-converter',
          label: 'lambda.guru',
        },
      },
      {
        name: 'Pip-Boy Image Converter',
        description:
          'Convert images for the Pip-Boy display with correct size and pixel format.',
        link: {
          href: 'https://xn--wxa.guru/software/pip-boy/image-converter',
          label: 'lambda.guru',
        },
      },
      {
        name: 'Pip-Boy Video Converter',
        description:
          'Convert video clips to Pip-Boy playback with correct resolution and encoding.',
        link: {
          href: 'https://xn--wxa.guru/software/pip-boy/video-converter',
          label: 'lambda.guru',
        },
      },
      {
        name: 'RobCo Industries - Pip-Boy',
        description:
          'Deep dives into how the Mk V works plus safe mods and experiments you can try.',
        link: {
          href: 'https://log.robco-industries.org/projects/pip-boy-3000-mk-v/',
          label: 'log.robco-industries.org',
        },
      },
      {
        name: 'RobCo Industries Blog & Docs',
        description:
          'Project logs, developer docs, and guides for hacking and extending the Pip-Boy.',
        link: {
          href: 'https://log.robco-industries.org/',
          label: 'log.robco-industries.org',
        },
      },
      {
        name: 'Independent Fallout Wiki',
        description: 'Community-run Fallout encyclopedia and resources hub.',
        link: {
          href: 'https://fallout.wiki/wiki/FalloutWiki:Independent_Fallout_Wiki',
          label: 'fallout.wiki',
        },
      },
    ],
  },
  {
    title: 'Open-Source & Guides',
    links: [
      {
        name: 'Official Pip-Boy Mod Tool',
        description:
          'Source for the official mod tool used to add apps to the Pip-Boy via Web Serial.',
        link: {
          href: 'https://github.com/thewandcompany/pip-boy',
          label: 'github.com',
        },
      },
      {
        name: 'Pip-Boy Apps (Community Repo)',
        description:
          'Community fork of the mod tool used to host and distribute fan-made apps and games for the Mk V on Pip-Boy.com.',
        link: {
          href: 'https://github.com/CodyTolene/pip-boy-apps',
          label: 'github.com',
        },
      },
      {
        name: 'Pip-Boy.com Source Code',
        description:
          'Source code for the pip-boy.com web terminal and companion app; useful for contributors who want to understand or improve the site.',
        link: {
          href: 'https://github.com/CodyTolene/pip-terminal',
          label: 'github.com',
        },
      },
      {
        name: 'Pip-Boy 3000 Community Guide',
        description:
          'Community-maintained guide collecting Mk V info, guides, and tools for modding, repairing, and troubleshooting the Wand Company Pip-Boy 3000 Mk V.',
        link: {
          href: 'https://raw.githubusercontent.com/beaverboy-12/The-Wand-Company-Pip-Boy-3000-Mk-V-Community-Guide/refs/heads/main/README.md',
          label: 'raw.githubusercontent.com',
        },
      },
    ],
  },
  {
    title: 'Espruino & Hardware',
    links: [
      {
        name: 'Espruino IDE (Web IDE)',
        description:
          'Browser-based IDE that connects via Web Serial; allows running JavaScript code, uploading scripts and interacting with the Espruino-powered Pip-Boy hardware.',
        link: {
          href: 'https://www.espruino.com/ide',
          label: 'espruino.com',
        },
      },
      {
        name: 'Espruino Pip-Boy Discussion',
        description:
          'Maintainer thread confirming the Mk V runs Espruino and discussing connecting and development.',
        link: {
          href: 'https://github.com/orgs/espruino/discussions/7577',
          label: 'github.com',
        },
      },
      {
        name: 'PIPBOY.py Board Definition',
        description:
          'Board definition file for the Pip-Boy in Espruino; useful for understanding pin mappings, build targets and firmware work.',
        link: {
          href: 'https://github.com/espruino/Espruino/blob/master/boards/PIPBOY.py',
          label: 'github.com',
        },
      },
    ],
  },
  {
    title: 'Community Products & Mods',
    links: [
      {
        name: 'Pip-Cam (AidansLab)',
        description:
          'To be announced - follow AidansLab for updates on this upcoming product.',
        link: {
          href: 'https://aidanslab.github.io/',
          label: 'aidanslab.github.io',
        },
      },
      {
        name: 'Pip-Glove (Darrian)',
        description:
          'To be announced - follow Darrian for updates on this upcoming product.',
        link: {
          href: 'https://log.robco-industries.org/',
          label: 'log.robco-industries.org',
        },
      },
    ],
  },
];
