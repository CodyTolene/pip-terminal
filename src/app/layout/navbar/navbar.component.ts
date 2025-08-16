import { Observable, map } from 'rxjs';
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
    {
      commands: ['terms-and-conditions'],
      label: 'Terms',
    },
    {
      commands: ['vault/:id'],
      label: 'Vault',
    },
  ];

  protected readonly linksChanges: Observable<PageLink[]> =
    this.auth.userChanges.pipe(
      map((user) => {
        return {
          // Filter links by user logged in state.
          links: this.links.filter((link) => {
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
              case 'Vault': {
                return user ? true : false;
              }
              default: {
                return true;
              }
            }
          }),
          user,
        };
      }),
      map(({ links, user }): PageLink[] => {
        // If user is logged in, update the Vault link to include user ID
        if (user) {
          return links.map((link) => {
            if (link.label === 'Vault') {
              return {
                ...link,
                commands: [`vault/${user.uid}` as 'vault/:id'],
              };
            }
            return link;
          });
        }
        return links;
      }),
    );

  private async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['']);
  }
}

interface PageLink {
  commands: ReadonlyArray<PageUrl | 'logout'>;
  label: PageName | 'Logout' | 'Pip-Boy 3000 Mk V' | 'Terms';
  exact?: boolean;
  isNewTab?: boolean;
  onClick?: () => void;
  queryParams?: Record<string, string | number>;
}
