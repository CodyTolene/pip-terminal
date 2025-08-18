import { PAGES } from 'src/app/routing';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StorageLocalService } from 'src/app/services/storage-local.service';

@Component({
  selector: 'pip-gdpr-banner',
  imports: [CommonModule, RouterModule],
  templateUrl: './gdpr-banner.component.html',
  styleUrl: './gdpr-banner.component.scss',
  standalone: true,
})
export class GdprBannerComponent implements OnInit {
  protected readonly privacyPolicyPage: PageUrl = PAGES['Privacy Policy'];
  protected readonly visible = signal(false);

  private readonly storage = inject(StorageLocalService);
  private readonly STORAGE_KEY = 'gdprConsent';

  public ngOnInit(): void {
    const consent = this.storage.get<boolean>(this.STORAGE_KEY);
    if (!consent) {
      this.visible.set(true);
    }
  }

  protected accept(): void {
    this.storage.set(this.STORAGE_KEY, true);
    this.visible.set(false);
  }
}
