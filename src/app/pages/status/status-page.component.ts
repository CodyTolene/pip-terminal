import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-status-page',
  templateUrl: './status-page.component.html',
  imports: [PipFooterComponent],
  styleUrls: ['./status-page.component.scss'],
  standalone: true,
})
export class StatusPageComponent {}
