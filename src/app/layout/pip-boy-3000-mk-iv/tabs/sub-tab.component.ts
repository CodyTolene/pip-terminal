import { SubTabLabelEnum } from 'src/app/enums';

import { Component, Input } from '@angular/core';

@Component({
  selector: 'pip-sub-tab',
  template: '',
  styles: [''],
  imports: [],
  providers: [],
  standalone: true,
})
export class SubTabComponent {
  @Input({ required: true }) public label!: SubTabLabelEnum;
}
