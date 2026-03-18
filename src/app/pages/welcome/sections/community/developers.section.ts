import { VAULT_TEC_USERS } from 'src/app/pages/welcome/sections/community/vault-tec-users';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';
import { VaultTecUserCardComponent } from 'src/app/components/vault-tec-user-card/vault-tec-user-card';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-developers]',
  templateUrl: './developers.section.html',
  styleUrls: ['../welcome-section.scss', './developers.section.scss'],
  imports: [
    PipButtonComponent,
    PipTitleComponent,
    RouterModule,
    VaultTecUserCardComponent,
  ],
})
export class WelcomeDevelopersSection {
  protected readonly vaultTecUserCards = vaultTecDevelopers;

  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }
}

const vaultTecDevelopers: readonly VaultTecUserInfo[] = [
  VAULT_TEC_USERS['rikkuness'],
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
];
