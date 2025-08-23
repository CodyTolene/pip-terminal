import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map } from 'rxjs';
import { AuthService, ToastService } from 'src/app/services';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';

import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

@UntilDestroy()
@Component({
  selector: 'pip-nav-list',
  template: `
    <nav aria-label="Main">
      @for (link of linksChanges | async; track link) {
        <a
          #rla="routerLinkActive"
          (click)="link.onClick?.($event); closeNavBar()"
          [attr.aria-current]="rla.isActive ? 'page' : null"
          [routerLinkActiveOptions]="
            link.exact ? { exact: true } : { exact: false }
          "
          [routerLink]="link.onClick ? null : link.commands"
          mat-list-item
          routerLinkActive="active"
          >{{ link.label }}</a
        >
      }
    </nav>
  `,
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
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
      label: 'Home',
      exact: true,
    },
    {
      commands: ['2000-mk-vi'],
      label: 'Pip-Boy 2000 Mk VI',
    },
    {
      commands: ['3000'],
      label: 'Pip-Boy 3000',
    },
    {
      commands: ['3000a'],
      label: 'Pip-Boy 3000A',
    },
    {
      commands: ['3000-mk-iv'],
      label: 'Pip-Boy 3000 Mk IV',
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
      onClick: async ($event: MouseEvent) => {
        $event.preventDefault();
        $event.stopPropagation();
        this.logout();
      },
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
      label: 'Terms and Conditions',
    },
    {
      commands: ['vault/:id'],
      label: 'My Vault',
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
  label:
    | 'Logout'
    | 'Pip-Boy 2000 Mk VI'
    | 'Pip-Boy 3000 Mk IV'
    | 'Pip-Boy 3000 Mk V'
    | 'Pip-Boy 3000'
    | 'Pip-Boy 3000A'
    | PageName;
  exact?: boolean;
  isNewTab?: boolean;
  onClick?: (mouseEvent: MouseEvent) => void;
  queryParams?: Record<string, string | number>;
}
