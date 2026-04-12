export interface VaultTecUserInfo {
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
