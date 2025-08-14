import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class NavbarComponent {
  protected readonly links = links;
}

interface PageLink {
  commands: PageUrl[];
  label: PageName | string;
  exact?: boolean;
  isNewTab?: boolean;
  queryParams?: Record<string, string | number>;
}

const links: readonly PageLink[] = [
  {
    commands: [''],
    label: 'Home',
    exact: true,
  },
  {
    commands: ['3000-mk-v'],
    label: 'Pip-Boy 3000 Mk V',
  },
  {
    commands: ['login'],
    label: 'Login',
  },
];
