import { Component } from '@angular/core';

import { PipPanelComponent } from 'src/app/components/panel/panel';

@Component({
  selector: 'pip-notice',
  templateUrl: './notice.html',
  styleUrl: './notice.scss',
  imports: [PipPanelComponent],
  standalone: true,
})
export class PipNotice {}
