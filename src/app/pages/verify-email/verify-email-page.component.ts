import { DateTime } from 'luxon';
import {
  distinctUntilChanged,
  firstValueFrom,
  map,
  startWith,
  take,
  timer,
} from 'rxjs';
import { VERIFY_EMAIL_STORAGE_KEY } from 'src/app/constants';
import { PipFooterComponent } from 'src/app/layout/footer/footer.component';
import { PipUser } from 'src/app/models';
import { AuthService, StorageLocalService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { reload, sendEmailVerification } from '@angular/fire/auth';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-verify-email-page',
  templateUrl: './verify-email-page.component.html',
  imports: [
    CommonModule,
    MatIconModule,
    PipButtonComponent,
    PipFooterComponent,
    RouterModule,
  ],
  styleUrl: './verify-email-page.component.scss',
  standalone: true,
})
export class VerifyEmailPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly storageLocal = inject(StorageLocalService);

  protected readonly userChanges = this.auth.userChanges;

  // Cooldowns
  private readonly RESEND_COOLDOWN_SECONDS = 300; // 5 minutes
  private readonly VERIFY_COOLDOWN_SECONDS = 10; // 10 seconds

  // Storage keys
  // Existing key continues to track "resend" attempts so your previous data still works.
  private readonly RESEND_KEY = VERIFY_EMAIL_STORAGE_KEY;
  // New key for "verify check" attempts
  private readonly VERIFY_KEY = 'verifyEmail:lastCheckAt';

  // ----- RESEND STREAMS -----
  private readonly remainingResendSecondsChanges = timer(0, 1000).pipe(
    startWith(
      this.secondsRemaining(this.RESEND_KEY, this.RESEND_COOLDOWN_SECONDS),
    ),
    map(() =>
      this.secondsRemaining(this.RESEND_KEY, this.RESEND_COOLDOWN_SECONDS),
    ),
    distinctUntilChanged(),
    shareSingleReplay(),
  );

  protected readonly isResendCoolingDownChanges =
    this.remainingResendSecondsChanges.pipe(
      map((s) => s > 0),
      distinctUntilChanged(),
    );

  protected readonly resendLabelChanges =
    this.remainingResendSecondsChanges.pipe(
      map((s) => (s > 0 ? `(${s}s)` : '')),
      distinctUntilChanged(),
    );

  private readonly remainingVerifySecondsChanges = timer(0, 1000).pipe(
    startWith(
      this.secondsRemaining(this.VERIFY_KEY, this.VERIFY_COOLDOWN_SECONDS),
    ),
    map(() =>
      this.secondsRemaining(this.VERIFY_KEY, this.VERIFY_COOLDOWN_SECONDS),
    ),
    distinctUntilChanged(),
    shareSingleReplay(),
  );

  protected readonly isVerifyCoolingDownChanges =
    this.remainingVerifySecondsChanges.pipe(
      map((s) => s > 0),
      distinctUntilChanged(),
    );

  protected readonly verifyLabelChanges =
    this.remainingVerifySecondsChanges.pipe(
      map((s) => (s > 0 ? `(${s}s)` : '')),
      distinctUntilChanged(),
    );

  protected readonly busyResend = signal(false);
  protected readonly busyVerify = signal(false);

  protected async resendVerificationEmail(): Promise<void> {
    if (this.busyResend()) return;

    const user = await this.getCurrentUserOnce();
    if (!user) {
      await this.router.navigate(['' as PageUrl]);
      return;
    }

    this.busyResend.set(true);
    try {
      // Return if cooldown
      if (
        this.secondsRemaining(this.RESEND_KEY, this.RESEND_COOLDOWN_SECONDS) > 0
      ) {
        return;
      }

      await sendEmailVerification(user.native);
      this.saveLastAttempt(this.RESEND_KEY, DateTime.now());
      this.snackBar.open('Verification email sent!', 'Close', {
        duration: 3000,
      });
    } catch (err) {
      console.error('[VerifyEmailPage] resendVerificationEmail failed:', err);
    } finally {
      this.busyResend.set(false);
    }
  }

  protected async checkVerification(): Promise<void> {
    if (this.busyVerify()) return;

    const user = await this.getCurrentUserOnce();
    if (!user) {
      await this.router.navigate(['' as PageUrl]);
      return;
    }

    this.busyVerify.set(true);
    try {
      // Return if cooldown
      if (
        this.secondsRemaining(this.VERIFY_KEY, this.VERIFY_COOLDOWN_SECONDS) > 0
      ) {
        return;
      }

      await reload(user.native);

      if (user.emailVerified) {
        const userVaultUrl = ('vault/:id' satisfies PageUrl).replace(
          ':id',
          user.uid,
        );
        this.snackBar.open('Email verified successfully!', 'Close', {
          duration: 3000,
        });
        await this.router.navigate([userVaultUrl as PageUrl]);
        return;
      }

      // Not verified yet. Start the 10s lockout
      this.saveLastAttempt(this.VERIFY_KEY, DateTime.now());
      this.snackBar.open(
        'Verification failed. Please check your inbox, then try again.',
        'Close',
        {
          duration: 3000,
        },
      );
    } catch (err) {
      console.error('[VerifyEmailPage] checkVerification failed:', err);
    } finally {
      this.busyVerify.set(false);
    }
  }

  private async getCurrentUserOnce(): Promise<PipUser | null> {
    return await firstValueFrom(this.userChanges.pipe(take(1)));
  }

  private saveLastAttempt(key: string, dt: DateTime): void {
    this.storageLocal.set<string>(key, dt.toISO());
  }

  private secondsRemaining(key: string, windowSeconds: number): number {
    const iso = this.storageLocal.get<string>(key);
    if (!iso) return 0;

    const last = DateTime.fromISO(iso);
    if (!last.isValid) return 0;

    const until = last.plus({ seconds: windowSeconds });
    const diff = Math.ceil(until.diff(DateTime.now(), 'seconds').seconds);
    return diff > 0 ? diff : 0;
  }
}
