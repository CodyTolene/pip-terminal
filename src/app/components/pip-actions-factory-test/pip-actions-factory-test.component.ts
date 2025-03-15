import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipDeviceService } from 'src/app/services/pip-device.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-factory-test',
  templateUrl: './pip-actions-factory-test.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-factory-test.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsFactoryTestComponent {
  public constructor(private readonly pipDeviceService: PipDeviceService) {}

  protected readonly signals = pipSignals;

  protected async factoryTestMode(): Promise<void> {
    await this.pipDeviceService.factoryTestMode();
  }

  protected async demoMode(): Promise<void> {
    await this.pipDeviceService.demoMode();
  }
}
