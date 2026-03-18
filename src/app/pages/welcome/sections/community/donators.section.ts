import { VAULT_TEC_USERS } from 'src/app/pages/welcome/sections/community/vault-tec-users';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';
import { VaultTecUserCardComponent } from 'src/app/components/vault-tec-user-card/vault-tec-user-card';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-donators]',
  templateUrl: './donators.section.html',
  styleUrls: ['../welcome-section.scss', './donators.section.scss'],
  imports: [
    PipButtonComponent,
    PipTitleComponent,
    RouterModule,
    VaultTecUserCardComponent,
  ],
})
export class WelcomeDonatorsSection {
  protected readonly vaultTecUserCards = vaultTecDonators;
  protected openDonatorsPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}

const vaultTecDonators: readonly VaultTecUserInfo[] = [
  VAULT_TEC_USERS['theeohn'],
  VAULT_TEC_USERS['sparercard'],
  VAULT_TEC_USERS['eckserah'],
  VAULT_TEC_USERS['s15Costuming'],
  VAULT_TEC_USERS['beanutPudder'],
  VAULT_TEC_USERS['crashrek'],
  VAULT_TEC_USERS['jimDenson'],
];
