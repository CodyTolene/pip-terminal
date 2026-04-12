export interface VaultTecUserInfo {
  boostDates?: readonly Date[];
  donationAmount?: number;
  images?: readonly string[];
  links?: readonly VaultTecUserInfoLink[];
  name: string;
  secondImageClass?: string;
  subtitles: ReadonlyArray<
    | 'Atomic Sponsor'
    | 'Discord Booster'
    | 'Vault-Tec Engineer'
    | 'Vault-Tec Support'
  >;
}

export interface VaultTecUserInfoLink {
  label: string;
  link: string;
  type: 'github' | 'other' | 'youtube';
}
