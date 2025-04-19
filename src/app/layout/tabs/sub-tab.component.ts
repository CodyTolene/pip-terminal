import { SubTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-sub-tab',
  templateUrl: './sub-tab.component.html',
  styles: [''],
  imports: [CommonModule, RouterModule],
  providers: [],
})
export class SubTabComponent {
  @Input({ required: true }) public label!: SubTabLabelEnum;

  @ViewChild('content', { static: true })
  public content!: TemplateRef<unknown>;
}
