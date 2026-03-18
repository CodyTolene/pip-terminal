import { VAULT_TEC_USERS } from 'src/app/pages/welcome/sections/community/vault-tec-users';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';
import { VaultTecUserCardComponent } from 'src/app/components/vault-tec-user-card/vault-tec-user-card';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-support]',
  templateUrl: './support.section.html',
  styleUrls: ['../welcome-section.scss', './support.section.scss'],
  imports: [PipTitleComponent, VaultTecUserCardComponent],
})
export class WelcomeSupportSection {
  protected readonly vaultTecUserCards = vaultTecSupporters;
}

const vaultTecSupporters: readonly VaultTecUserInfo[] = [
  /** Support */
  VAULT_TEC_USERS['forgoneZ'],
  VAULT_TEC_USERS['matchwood'],
  /** Moderators */
  VAULT_TEC_USERS['azrael'],
  VAULT_TEC_USERS['nightmareGoggles'],
  VAULT_TEC_USERS['rikkuness'],
  VAULT_TEC_USERS['theeohn'],
];
