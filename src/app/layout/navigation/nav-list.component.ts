import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, startWith } from 'rxjs';
import { AuthService, ToastService } from 'src/app/services';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

import { PageName } from 'src/app/types/page-name';
import { PageUrl } from 'src/app/types/page-url';

@UntilDestroy()
@Component({
  selector: 'pip-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.scss'],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    PipBadgeComponent,
    RouterModule,
  ],
  standalone: true,
})
export class NavListComponent {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly isNavbarOpenSignal = isNavbarOpenSignal;

  private readonly links: readonly PageLink[] = [
    {
      commands: [''],
      icon: 'home',
      label: 'Home',
      exact: true,
    },
    {
      commands: ['vault/:id'],
      icon: 'account_balance',
      label: 'My Vault',
    },
    {
      commands: ['login'],
      icon: 'login',
      label: 'Login',
    },
    {
      commands: ['register'],
      icon: 'person_add',
      label: 'Register',
    },
    {
      onClick: async ($event: MouseEvent) => {
        $event.preventDefault();
        $event.stopPropagation();
        this.logout();
      },
      commands: ['logout'],
      icon: 'logout',
      label: 'Logout',
    },
    {
      commands: ['forum'],
      icon: 'forum',
      isNewFeature: true,
      label: 'Forum',
    },
    {
      commands: ['2000-mk-vi'],
      icon: 'star',
      label: 'Pip-Boy 2000 Mk VI',
    },
    {
      commands: ['3000'],
      icon: 'star',
      label: 'Pip-Boy 3000',
    },
    {
      commands: ['3000a'],
      icon: 'star',
      label: 'Pip-Boy 3000A',
    },
    {
      commands: ['3000-mk-iv'],
      icon: 'star',
      label: 'Pip-Boy 3000 Mk IV',
    },
    {
      commands: ['3000-mk-v'],
      icon: 'star',
      label: 'Pip-Boy 3000 Mk V',
    },
    {
      commands: ['status'],
      icon: 'search_insights',
      label: 'Status',
    },
    {
      commands: ['support'],
      icon: 'contact_support',
      label: 'Support',
    },
    {
      commands: ['privacy-policy'],
      icon: 'privacy_tip',
      label: 'Privacy Policy',
    },
    {
      commands: ['terms-and-conditions'],
      icon: 'gavel',
      label: 'Terms and Conditions',
    },
  ];

  protected readonly linksChanges: Observable<PageLink[]> =
    this.auth.userChanges.pipe(
      startWith(null),
      map((user) => {
        return {
          // Filter links by user logged in state.
          links: this.links.filter((link) => {
            switch (link.label) {
              // If logged in, hide these
              // If logged out, show these
              case 'Login':
              case 'Register': {
                return user ? false : true;
              }
              // If logged in, show these
              // If logged out, hide these
              case 'Logout':
              case 'My Vault': {
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
            if (link.label === 'My Vault') {
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

  protected closeNavBar(): void {
    if (this.isNavbarOpenSignal()) {
      this.isNavbarOpenSignal.set(false);
    }
  }

  private logout(): void {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to logout?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldLogout) => {
        if (!shouldLogout) {
          return;
        }

        await this.auth.signOut();
        this.toast.success({
          message: 'Logged out successfully.',
          durationSecs: 3,
        });
        await this.router.navigate(['']);
      });
  }
}

interface PageLink {
  commands: ReadonlyArray<PageUrl | 'logout'>;
  icon: string;
  label:
    | 'Logout'
    | 'Pip-Boy 2000 Mk VI'
    | 'Pip-Boy 3000 Mk IV'
    | 'Pip-Boy 3000 Mk V'
    | 'Pip-Boy 3000'
    | 'Pip-Boy 3000A'
    | PageName;
  exact?: boolean;
  isNewFeature?: boolean;
  isNewTab?: boolean;
  onClick?: (mouseEvent: MouseEvent) => void;
  queryParams?: Record<string, string | number>;
}
