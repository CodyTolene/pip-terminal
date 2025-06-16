import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {}
