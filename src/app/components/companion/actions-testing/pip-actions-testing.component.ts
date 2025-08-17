import { PipDeviceService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';

import { Component, inject } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-actions-testing',
  templateUrl: './pip-actions-testing.component.html',
  styleUrls: ['./pip-actions-testing.component.scss'],
  imports: [PipButtonComponent],
})
export class PipActionsTestingComponent {
  private readonly pipDeviceService = inject(PipDeviceService);

  protected readonly signals = pipSignals;

  protected async demoMode(): Promise<void> {
    await this.pipDeviceService.demoMode();
  }

  protected async factoryTestMode(): Promise<void> {
    await this.pipDeviceService.factoryTestMode();
  }
}
