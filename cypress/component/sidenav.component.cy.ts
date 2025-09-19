import { MountResponse, mount } from 'cypress/angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { SidenavComponent } from 'src/app/layout/navigation/sidenav.component';
import { AuthService, ToastService } from 'src/app/services';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { provideRouter } from '@angular/router';

interface MockUser {
  uid: string;
  email?: string;
}

class MockAuthService {
  public userChanges = new BehaviorSubject<MockUser | null>(null);

  public signOut(): Promise<void> {
    return Promise.resolve();
  }
}

class MockDialogRef<T> {
  private subj = new Subject<T>();
  public afterClosed(): Observable<T> {
    return this.subj.asObservable();
  }
  public __closeWith(v: T): void {
    this.subj.next(v);
    this.subj.complete();
  }
}

class MockMatDialog {
  public lastRef: MockDialogRef<boolean | null> | null = null;
  public open(): MockDialogRef<boolean | null> {
    this.lastRef = new MockDialogRef<boolean | null>();
    return this.lastRef;
  }
}

class MockToastService {
  public success(_opts?: unknown): void {
    // n/o
  }
}

@Component({
  selector: 'pip-host',
  template: `
    <pip-sidenav>
      <div class="page-content">Hello content</div>
    </pip-sidenav>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [SidenavComponent],
})
class HostComponent {}

describe('SidenavComponent', () => {
  let auth: MockAuthService;
  let dialog: MockMatDialog;
  let toast: MockToastService;

  beforeEach(() => {
    isNavbarOpenSignal.set(false);
    auth = new MockAuthService();
    dialog = new MockMatDialog();
    toast = new MockToastService();
  });

  function mountHost(): Cypress.Chainable<MountResponse<HostComponent>> {
    return mount(HostComponent, {
      imports: [CommonModule, MatSidenavModule, MatListModule],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: AuthService, useValue: auth },
        { provide: MatDialog, useValue: dialog },
        { provide: ToastService, useValue: toast },
      ],
    });
  }

  it('opens when the signal is true and shows the PIP-OS banner with version', () => {
    mountHost();

    cy.get('mat-sidenav').should('have.css', 'visibility', 'hidden');

    cy.then(() => isNavbarOpenSignal.set(true));

    cy.get('mat-sidenav').should('have.css', 'visibility', 'visible');

    cy.get('.nav-message-title').within(() => {
      cy.contains(`PIP-OS(R) v${APP_VERSION}`).should('be.visible');
      cy.contains('Select one of the following options:').should('be.visible');
    });

    cy.get('mat-sidenav pip-nav-list').should('exist');
  });

  it('closes when clicking the backdrop', () => {
    mountHost();

    cy.then(() => isNavbarOpenSignal.set(true));

    cy.get('mat-sidenav').should('have.css', 'visibility', 'visible');

    cy.get('mat-sidenav-container .mat-drawer-backdrop')
      .should('be.visible')
      .click({ force: true });

    cy.then(() => {
      expect(isNavbarOpenSignal()).to.eq(false);
    });

    cy.get('mat-sidenav').should('have.css', 'visibility', 'hidden');
  });

  it('can assert signOut and toast.success are called', () => {
    mountHost();

    cy.spy(auth, 'signOut').as('signOut');
    cy.spy(toast, 'success').as('toastSuccess');
  });
});
