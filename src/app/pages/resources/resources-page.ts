import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-resources-page',
  templateUrl: './resources-page.html',
  imports: [CommonModule, PipFooterComponent],
  styleUrl: './resources-page.scss',
  standalone: true,
})
export class ResourcesPage {}
