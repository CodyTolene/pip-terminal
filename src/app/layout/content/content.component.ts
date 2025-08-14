import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-content',
  template: '<router-outlet />',
  imports: [CommonModule, RouterModule],
  styleUrl: './content.component.scss',
  providers: [],
  standalone: true,
})
export class ContentComponent {}
