import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-roles]',
  templateUrl: './roles.section.html',
  styleUrls: ['./welcome-section.scss', './roles.section.scss'],
  imports: [RouterModule],
})
export class WelcomeRolesSection {}
