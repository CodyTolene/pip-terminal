import { Component } from '@angular/core';

import { PipPanelComponent } from 'src/app/components/panel/panel.component';

@Component({
  selector: 'pip-notice',
  templateUrl: './notice.component.html',
  styleUrl: './notice.component.scss',
  imports: [PipPanelComponent],
  standalone: true,
})
export class PipNoticeComponent {}
