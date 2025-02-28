import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipTabComponent } from './pip-tab.component';
import { PipTabsComponent } from './pip-tabs.component';

@NgModule({
  declarations: [PipTabComponent, PipTabsComponent],
  imports: [CommonModule],
  exports: [PipTabComponent, PipTabsComponent],
})
export class PipTabModule {}
