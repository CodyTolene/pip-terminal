export interface VaultTecUserInfo {
  boostDates?: readonly Date[];
  donationAmount?: number;
  images?: readonly string[];
  links?: readonly VaultTecUserInfoLink[];
  name: string;
  secondImageClass?: string;
}

export interface VaultTecUserInfoLink {
  label: string;
  link: string;
  type: 'github' | 'other' | 'youtube';
}
