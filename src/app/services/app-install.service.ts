import { Injectable, OnDestroy, signal } from '@angular/core';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

@Injectable({ providedIn: 'root' })
export class AppInstallService implements OnDestroy {
  public constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt);
    window.addEventListener('appinstalled', this.onAppInstalled);
  }

  public readonly canInstall = signal(false);

  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  public async promptInstall(): Promise<void> {
    if (!this.deferredPrompt) {
      return;
    }

    await this.deferredPrompt.prompt();
    await this.deferredPrompt.userChoice;

    this.deferredPrompt = null;
    this.canInstall.set(false);
  }

  public ngOnDestroy(): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.removeEventListener(
      'beforeinstallprompt',
      this.onBeforeInstallPrompt,
    );
    window.removeEventListener('appinstalled', this.onAppInstalled);
  }

  private onBeforeInstallPrompt = (event: Event): void => {
    event.preventDefault();
    this.deferredPrompt = event as BeforeInstallPromptEvent;
    this.canInstall.set(true);
  };

  private onAppInstalled = (): void => {
    this.deferredPrompt = null;
    this.canInstall.set(false);
  };
}
