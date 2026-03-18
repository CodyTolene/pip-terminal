import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

type VaultTecUser =
  | 'athene'
  | 'azrael'
  | 'beanutPudder'
  | 'crashrek'
  | 'dougie'
  | 'eckserah'
  | 'forgoneZ'
  | 'gfwilliams'
  | 'hazaa7395'
  | 'homicidalMailman'
  | 'jimDenson'
  | 'killes'
  | 'lore5032'
  | 'matchwood'
  | 'mercy'
  | 'michal092395'
  | 'nightmareGoggles'
  | 'pip4111'
  | 'rblakesley'
  | 'rikkuness'
  | 's15Costuming'
  | 'sparercard'
  | 'tetriskid'
  | 'theeohn';

export const VAULT_TEC_USERS: Record<VaultTecUser, VaultTecUserInfo> = {
  athene: {
    name: 'gnargle',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/gnargle',
        type: 'github',
      },
    ],
  },
  azrael: {
    name: 'beaverboy-12',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/beaverboy-12',
        type: 'github',
      },
    ],
  },
  beanutPudder: {
    name: 'BeanutPudder',
    donationAmount: 5,
    images: ['images/community/beanut_pudder_250x250.jpg'],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/BeanutPudder',
        type: 'github',
      },
    ],
  },
  crashrek: {
    name: 'Rio Padilla',
    donationAmount: 5,
    images: ['images/community/rio_padilla_250x250.jpg'],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/RioRocketMan',
        type: 'github',
      },
      {
        label: 'Instagram',
        link: 'https://www.instagram.com/slainpublic?igsh=MXAxaW42b3FkNmp0eA==',
        type: 'other',
      },
    ],
  },
  dougie: {
    name: 'Dougie',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/Dougie-1',
        type: 'github',
      },
    ],
  },
  eckserah: {
    name: 'eckserah',
    donationAmount: 20,
    images: ['images/community/eckserah_birdstion_250x250.png'],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/eckserah',
        type: 'github',
      },
      {
        label: 'Fallout Wiki',
        link: 'https://fallout.wiki/',
        type: 'other',
      },
    ],
  },
  forgoneZ: {
    name: 'Forgone.Z',
    links: [
      {
        label: 'Linktree',
        link: 'https://linktr.ee/Forgone.Z',
        type: 'other',
      },
    ],
  },
  gfwilliams: {
    name: 'Gordon Williams',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/gfwilliams',
        type: 'github',
      },
      {
        label: 'Personal Website',
        link: 'https://www.pur3.co.uk/',
        type: 'other',
      },
    ],
  },
  hazaa7395: {
    name: 'Hazaa',
    boostDates: [new Date(2026, 0, 3), new Date(2026, 0, 4)],
  },
  homicidalMailman: {
    name: 'tylerjbartlett',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/tylerjbartlett',
        type: 'github',
      },
    ],
  },
  jimDenson: {
    name: 'Jim D.',
    donationAmount: 5,
    images: ['images/community/jim_d_250x250.jpg'],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/JLDenson',
        type: 'github',
      },
      {
        label: 'YouTube',
        link: 'https://www.youtube.com/@jamesdenson4730',
        type: 'youtube',
      },
    ],
  },
  killes: {
    name: 'killes007',
    boostDates: [new Date(2025, 3, 14)],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/killes007',
        type: 'github',
      },
    ],
  },
  lore5032: {
    name: 'Lore',
    boostDates: [new Date(2026, 2, 16), new Date(2026, 2, 16)],
  },
  michal092395: {
    name: 'Michal',
    boostDates: [new Date(2026, 1, 25), new Date(2026, 1, 25)],
  },
  matchwood: {
    name: 'Matchwood',
  },
  mercy: {
    name: 'MercurialPony',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/MercurialPony',
        type: 'github',
      },
    ],
  },
  nightmareGoggles: {
    name: 'AidansLab',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/AidansLab',
        type: 'github',
      },
      {
        label: 'YouTube',
        link: 'https://www.youtube.com/@Aidans_Lab',
        type: 'youtube',
      },
      {
        label: 'Personal Website',
        link: 'https://aidanslab.github.io/',
        type: 'other',
      },
    ],
  },
  pip4111: {
    name: 'pip4111',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/pip-4111',
        type: 'github',
      },
    ],
  },
  rblakesley: {
    name: 'Richard Blakesley',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/rblakesley',
        type: 'github',
      },
    ],
  },
  rikkuness: {
    name: 'Darrian',
    boostDates: [new Date(2025, 9, 9)],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/rikkuness',
        type: 'github',
      },
      {
        label: 'RobCo-Industries.org',
        link: 'https://log.robco-industries.org/',
        type: 'other',
      },
    ],
  },
  s15Costuming: {
    name: 'S15 Costuming',
    donationAmount: 5,
    images: [
      'images/community/s15_costuming_250x250.jpeg',
      'images/community/s15_costuming_plate_250x250.png',
    ],
    secondImageClass: 'overlay',
    links: [
      {
        label: 'Linktree',
        link: 'https://linktr.ee/S15Costuming',
        type: 'other',
      },
    ],
  },
  sparercard: {
    name: 'Sparercard',
    donationAmount: 25,
    images: ['images/community/sparercard_250x250.jpg'],
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/Sparercard',
        type: 'github',
      },
    ],
  },
  tetriskid: {
    name: 'TetrisKid48',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/TetrisKid48',
        type: 'github',
      },
      {
        label: 'Personal Website',
        link: 'https://tetriskid48.github.io/',
        type: 'other',
      },
    ],
  },
  theeohn: {
    name: 'Theeohn',
    donationAmount: 25,
    images: [
      'images/community/theeohn_megistus_no_glasses_250x250.png',
      'images/community/theeohn_megistus_glasses_250x250.png',
    ],
    secondImageClass: 'scroll-in-top',
    links: [
      {
        label: 'GitHub',
        link: 'https://github.com/Theeohn',
        type: 'github',
      },
      {
        label: 'YouTube',
        link: 'https://youtube.com/@theeohnm?si=ELPEw76GxJQgJgWE',
        type: 'youtube',
      },
    ],
  },
};
