import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-links-page',
  templateUrl: './links-resources-page.html',
  imports: [CommonModule, PipFooterComponent],
  styleUrl: './links-resources-page.scss',
  standalone: true,
})
export class LinksResourcesPage {}
