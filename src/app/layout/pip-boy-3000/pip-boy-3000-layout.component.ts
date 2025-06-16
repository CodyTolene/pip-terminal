import { ContentComponent } from 'src/app/layout/content/content.component';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-boy-3000-layout',
  templateUrl: './pip-boy-3000-layout.component.html',
  imports: [CommonModule, ContentComponent],
  styleUrl: './pip-boy-3000-layout.component.scss',
  providers: [],
})
export class PipBoy3000LayoutComponent {}
