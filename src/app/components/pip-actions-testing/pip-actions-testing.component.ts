import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipDeviceService } from 'src/app/services/pip-device.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-testing',
  templateUrl: './pip-actions-testing.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-testing.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsTestingComponent {
  public constructor(private readonly pipDeviceService: PipDeviceService) {}

  protected readonly signals = pipSignals;

  protected async demoMode(): Promise<void> {
    await this.pipDeviceService.demoMode();
  }

  protected async factoryTestMode(): Promise<void> {
    await this.pipDeviceService.factoryTestMode();
  }
}
