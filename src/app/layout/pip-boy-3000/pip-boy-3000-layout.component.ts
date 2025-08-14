import { ContentComponent } from 'src/app/layout/content/content.component';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-boy-3000-layout',
  template: '<pip-content />',
  imports: [CommonModule, ContentComponent],
  providers: [],
  standalone: true,
})
export class PipBoy3000LayoutComponent {}
