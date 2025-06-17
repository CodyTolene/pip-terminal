import { PipHeaderComponent } from 'src/app/layout/header/header.component';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-layout',
  templateUrl: './pip-boy-3000-mk-v-companion-layout.component.html',
  imports: [CommonModule, PipHeaderComponent, RouterModule],
  styleUrl: './pip-boy-3000-mk-v-companion-layout.component.scss',
  providers: [],
})
export class PipBoy3000MkVCompanionLayoutComponent {}
