import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title';
import { VaultTecUserCardComponent } from 'src/app/components/vault-tec-user-card/vault-tec-user-card';

import { VAULT_TEC_USERS } from 'src/app/constants/vault-tec-users';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-community]',
  templateUrl: './community.section.html',
  styleUrls: ['./welcome-section.scss', './community.section.scss'],
  imports: [PipTitleComponent, RouterModule, VaultTecUserCardComponent],
})
export class WelcomeCommunitySection {
  protected readonly atomicSponsors = atomicSponsors;
  protected readonly vaultTechUsers = vaultTechUsers;
}

const atomicSponsors: readonly VaultTecUserInfo[] = [
  VAULT_TEC_USERS['theeohn'],
  VAULT_TEC_USERS['sparercard'],
  VAULT_TEC_USERS['eckserah'],
  VAULT_TEC_USERS['s15Costuming'],
  VAULT_TEC_USERS['beanutPudder'],
  VAULT_TEC_USERS['crashrek'],
  VAULT_TEC_USERS['jimDenson'],
  VAULT_TEC_USERS['rikkuness'],
];

const vaultTechUsers: readonly VaultTecUserInfo[] = [
  VAULT_TEC_USERS['gfwilliams'],
  VAULT_TEC_USERS['rblakesley'],
  VAULT_TEC_USERS['nightmareGoggles'],
  VAULT_TEC_USERS['athene'],
  VAULT_TEC_USERS['mercy'],
  VAULT_TEC_USERS['pip4111'],
  VAULT_TEC_USERS['killes'],
  VAULT_TEC_USERS['tetriskid'],
  VAULT_TEC_USERS['homicidalMailman'],
  VAULT_TEC_USERS['dougie'],
  VAULT_TEC_USERS['azrael'],
  VAULT_TEC_USERS['forgoneZ'],
  VAULT_TEC_USERS['matchwood'],
  VAULT_TEC_USERS['hazaa7395'],
  VAULT_TEC_USERS['michal092395'],
  VAULT_TEC_USERS['lore5032'],
];
