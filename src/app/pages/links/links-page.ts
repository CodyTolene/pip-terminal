import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-links-page',
  templateUrl: './links-page.html',
  imports: [CommonModule, PipFooterComponent],
  styleUrl: './links-page.scss',
  standalone: true,
})
export class LinksPage {}
