import { PipDeviceService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';

import { Component, inject } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-actions-testing',
  templateUrl: './pip-actions-testing.html',
  styleUrls: ['./pip-actions-testing.scss'],
  imports: [PipButtonComponent, PipTitleComponent],
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
