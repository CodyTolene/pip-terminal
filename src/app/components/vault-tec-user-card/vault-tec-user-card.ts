import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipIconComponent } from 'src/app/components/icon/icon';

import { VaultTecUserInfo } from 'src/app/types/vault-tec-user-info';

@Component({
  selector: 'pip-vault-tec-user-card',
  imports: [CommonModule, MatTooltipModule, NgTemplateOutlet, PipIconComponent],
  templateUrl: './vault-tec-user-card.html',
  styleUrl: './vault-tec-user-card.scss',
})
export class VaultTecUserCardComponent {
  public type = input.required<
    'booster' | 'donator' | 'engineer' | 'support'
  >();

  public userCard = input.required<VaultTecUserInfo>();

  public subtitle = input<
    | 'Atomic Sponsor'
    | 'Discord Booster'
    | 'Vault-Tec Engineer'
    | 'Vault-Tec Support'
    | null
  >(null);

  public get class(): string {
    return this.type();
  }
}
