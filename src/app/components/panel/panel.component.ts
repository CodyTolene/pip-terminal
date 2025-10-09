import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-panel',
  template: `<ng-content />`,
  imports: [CommonModule],
  styleUrl: './panel.component.scss',
  providers: [],
})
export class PipPanelComponent {}
