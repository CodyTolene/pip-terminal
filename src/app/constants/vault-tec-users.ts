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
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Vault-Tec Support'],
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
    subtitles: ['Atomic Sponsor'],
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
    subtitles: ['Atomic Sponsor'],
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
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Atomic Sponsor'],
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
    subtitles: ['Vault-Tec Support'],
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
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Discord Booster'],
  },
  homicidalMailman: {
    name: 'tylerjbartlett',
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Atomic Sponsor', 'Vault-Tec Engineer'],
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
    subtitles: ['Vault-Tec Engineer', 'Discord Booster'],
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
    subtitles: ['Discord Booster'],
  },
  michal092395: {
    name: 'Michal',
    boostDates: [new Date(2026, 1, 25), new Date(2026, 1, 25)],
    subtitles: ['Discord Booster'],
  },
  matchwood: {
    name: 'Matchwood',
    subtitles: ['Vault-Tec Support'],
  },
  mercy: {
    name: 'MercurialPony',
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Vault-Tec Engineer', 'Vault-Tec Support'],
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
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Vault-Tec Engineer'],
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
    donationAmount: 5,
    subtitles: [
      'Atomic Sponsor',
      'Vault-Tec Engineer',
      'Vault-Tec Support',
      'Discord Booster',
    ],
    images: ['images/community/rikkuness_250x250.png'],
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
    subtitles: ['Atomic Sponsor'],
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
    subtitles: ['Atomic Sponsor'],
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
    subtitles: ['Vault-Tec Engineer'],
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
    subtitles: ['Atomic Sponsor', 'Vault-Tec Support'],
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
