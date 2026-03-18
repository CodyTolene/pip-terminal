import { VAULT_TEC_USERS } from 'src/app/pages/welcome/sections/community/vault-tec-users';

import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';
import { VaultTecUserCardComponent } from 'src/app/components/vault-tec-user-card/vault-tec-user-card';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-boosters]',
  templateUrl: './boosters.section.html',
  styleUrls: ['../welcome-section.scss', './boosters.section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, VaultTecUserCardComponent],
})
export class WelcomeBoostersSection {
  protected readonly vaultTecUserCards = vaultTecDiscordServerBoosters;

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}

const vaultTecDiscordServerBoosters: readonly VaultTecUserInfo[] = [
  VAULT_TEC_USERS['killes'],
  VAULT_TEC_USERS['rikkuness'],
  VAULT_TEC_USERS['hazaa7395'],
  VAULT_TEC_USERS['michal092395'],
  VAULT_TEC_USERS['lore5032'],
];
