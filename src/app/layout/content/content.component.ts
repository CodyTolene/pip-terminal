import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-content',
  template: '<router-outlet />',
  imports: [RouterModule],
  styleUrl: './content.component.scss',
  providers: [],
  standalone: true,
})
export class ContentComponent {}
