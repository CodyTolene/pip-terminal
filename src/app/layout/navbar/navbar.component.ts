import { map } from 'rxjs';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'pip-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterModule],
  standalone: true,
})
export class NavbarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly links: readonly PageLink[] = [
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
    {
      commands: ['register'],
      label: 'Register',
    },
    {
      onClick: async () => await this.logout(),
      commands: ['logout'],
      label: 'Logout',
    },
    {
      commands: ['status'],
      label: 'Status',
    },
    {
      commands: ['privacy-policy'],
      label: 'Privacy Policy',
    },
  ];

  protected readonly linksChanges = this.auth.userChanges.pipe(
    map((user) => {
      return this.links.filter((link) => {
        switch (link.label) {
          case 'Login': {
            return user ? false : true;
          }
          case 'Register': {
            return user ? false : true;
          }
          case 'Logout': {
            return user ? true : false;
          }
          default: {
            return true;
          }
        }
      });
    }),
  );

  private async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['']);
  }
}

interface PageLink {
  commands: ReadonlyArray<PageUrl | 'logout'>;
  label: PageName | 'Logout' | 'Pip-Boy 3000 Mk V';
  exact?: boolean;
  isNewTab?: boolean;
  onClick?: () => void;
  queryParams?: Record<string, string | number>;
}
