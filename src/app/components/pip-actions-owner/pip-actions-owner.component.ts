import { CommonModule } from '@angular/common';
import { Component, EffectRef, OnDestroy, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipSetDataService } from 'src/app/services/pip-set-data.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-owner',
  templateUrl: './pip-actions-owner.component.html',
  imports: [CommonModule, FormsModule, PipButtonComponent],
  styleUrl: './pip-actions-owner.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsOwnerComponent implements OnDestroy {
  public constructor(private readonly setDataService: PipSetDataService) {
    this.ownerNameEffect = effect(() => {
      const name = this.signals.ownerName();
      this.ownerName = name === '' || name === '<NONE>' ? null : name;
    });
  }

  protected ownerName: string | null = null;

  protected readonly signals = pipSignals;

  private readonly ownerNameEffect: EffectRef;

  public ngOnDestroy(): void {
    this.ownerNameEffect.destroy();
  }

  protected async resetOwnerName(): Promise<void> {
    await this.setDataService.resetOwnerName();
  }

  protected async setOwnerName(name: string | null): Promise<void> {
    await this.setDataService.setOwnerName(name);
  }
}
