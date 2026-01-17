import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';

import { GdprBannerComponent } from 'src/app/components/gdpr-banner/gdpr-banner.component';

import { StorageLocalService } from 'src/app/services/storage-local.service';

class MockStorageLocalService implements Pick<
	StorageLocalService,
	'get' | 'set'
>{
  private readonly store = new Map<string, unknown>();

  public get<T>(key: string): T | null {
    const val = this.store.get(key);
    return (val as T) ?? null;
  }

  public set<T>(key: string, value: T | null, _expiration?: unknown): void {
    if (value === null) {
      this.store.delete(key);
    } else {
      this.store.set(key, value);
    }
  }
}

describe('GdprBannerComponent', () => {
  it('shows the banner when consent is not present and hides it after acceptance', () => {
    cy.mount(GdprBannerComponent, {
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        { provide: StorageLocalService, useClass: MockStorageLocalService },
      ],
    });

    cy.contains('Pip-Boy.com uses cookies', { timeout: 5000 }).should(
      'be.visible',
    );

    cy.contains('Accept').click();

    cy.contains('Pip-Boy.com uses cookies').should('not.exist');
  });
});
