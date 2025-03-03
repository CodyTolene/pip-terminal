import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipSubTabComponent } from './pip-sub-tab.component';
import { PipSubTabsComponent } from './pip-sub-tabs.component';

@NgModule({
  declarations: [PipSubTabComponent, PipSubTabsComponent],
  imports: [CommonModule],
  exports: [PipSubTabComponent, PipSubTabsComponent],
})
export class PipSubTabModule {}
