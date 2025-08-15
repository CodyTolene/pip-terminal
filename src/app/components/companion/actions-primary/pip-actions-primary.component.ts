import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { PipConnectionService, PipDeviceService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';

import { Component, inject } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-actions-primary',
  templateUrl: './pip-actions-primary.component.html',
  imports: [PipButtonComponent],
  styleUrl: './pip-actions-primary.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsPrimaryComponent {
  private readonly pipConnectionService = inject(PipConnectionService);
  private readonly pipDeviceService = inject(PipDeviceService);

  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly signals = pipSignals;

  protected async connect(): Promise<void> {
    await this.pipConnectionService.connect();
    await this.pipDeviceService.initialize();
  }

  protected async disconnect(): Promise<void> {
    await this.pipConnectionService.disconnect();
  }

  protected async restart(): Promise<void> {
    await this.pipDeviceService.restart();
  }

  protected async shutdown(): Promise<void> {
    await this.pipDeviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.pipDeviceService.sleep();
  }

  protected async wake(): Promise<void> {
    await this.pipDeviceService.wake();
  }
}
