import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-content',
  template: '<router-outlet />',
  imports: [RouterModule],
  styleUrl: './content.scss',
  providers: [],
  standalone: true,
})
export class Content {}
