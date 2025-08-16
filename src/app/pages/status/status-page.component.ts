import { PipFooterComponent } from 'src/app/layout';
import { StatusService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'pip-status-page',
  templateUrl: './status-page.component.html',
  imports: [CommonModule, PipFooterComponent],
  providers: [StatusService],
  styleUrls: ['./status-page.component.scss'],
  standalone: true,
})
export class StatusPageComponent {
  private readonly statusService = inject(StatusService);
  protected readonly statusChanges = this.statusService.get();
}
