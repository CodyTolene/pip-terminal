import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-content',
  templateUrl: './content.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './content.component.scss',
  providers: [],
  standalone: true,
})
export class ContentComponent {}
