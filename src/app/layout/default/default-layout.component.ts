import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-default-layout',
  template: `<router-outlet />`,
  styleUrls: ['./default-layout.component.scss'],
  imports: [RouterModule],
  standalone: true,
})
export class DefaultLayoutComponent {}
