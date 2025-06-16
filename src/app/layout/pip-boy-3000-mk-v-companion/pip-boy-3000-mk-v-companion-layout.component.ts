import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipHeaderComponent } from 'src/app/layout/header/header.component';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-layout',
  templateUrl: './pip-boy-3000-mk-v-companion-layout.component.html',
  imports: [CommonModule, ContentComponent, PipHeaderComponent],
  styleUrl: './pip-boy-3000-mk-v-companion-layout.component.scss',
  providers: [],
})
export class PipBoy3000MkVCompanionLayoutComponent {}
