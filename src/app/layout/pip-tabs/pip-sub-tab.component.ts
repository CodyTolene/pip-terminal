import { PipSubTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'pip-sub-tab',
  templateUrl: './pip-sub-tab.component.html',
  styles: [''],
  imports: [CommonModule],
  providers: [],
})
export class PipSubTabComponent {
  @Input({ required: true }) public label!: PipSubTabLabelEnum;

  @ViewChild('content', { static: true })
  public content!: TemplateRef<unknown>;
}
