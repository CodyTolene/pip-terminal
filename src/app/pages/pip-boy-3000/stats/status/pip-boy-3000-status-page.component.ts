import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-boy-3000-status-page',
  templateUrl: './pip-boy-3000-status-page.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './pip-boy-3000-status-page.component.scss',
  standalone: true,
})
export class PipBoy3000StatusPageComponent {}
