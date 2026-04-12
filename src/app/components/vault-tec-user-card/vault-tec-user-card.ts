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
  public type = input.required<'sponsor' | 'vault-tec'>();

  public userCard = input.required<VaultTecUserInfo>();

  public get class(): string {
    return this.type();
  }

  protected getBoostDatesText(boostDates: readonly Date[] | undefined): string {
    if (!boostDates || boostDates.length === 0) {
      return '';
    }
    const boostDatesText = boostDates
      .map((date) => date.toLocaleDateString())
      .join(', ');

    return boostDatesText;
  }
}
