import { SubTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pip-sub-tab',
  template: '',
  styles: [''],
  imports: [CommonModule],
  providers: [],
})
export class SubTabComponent {
  @Input({ required: true }) public label!: SubTabLabelEnum;
}
