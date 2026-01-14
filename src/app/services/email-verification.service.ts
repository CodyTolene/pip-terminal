import { DateTime } from 'luxon';
import { VERIFY_EMAIL_STORAGE_KEY } from 'src/app/constants';
import { StorageLocalService } from 'src/app/services';

import { Injectable, inject } from '@angular/core';
import { User, sendEmailVerification } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class EmailVerificationService {
  private readonly storage = inject(StorageLocalService);
  private readonly inFlightUids = new Set<string>();

  public async sendIfEligible(
    user: User,
    coolDownSeconds: number,
  ): Promise<boolean> {
    if (!user || user.emailVerified) {
      return false;
    }

    if (this.inFlightUids.has(user.uid)) {
      return false;
    }

    const remaining = this.secondsRemaining(coolDownSeconds);
    if (remaining > 0) {
      return false;
    }

    this.inFlightUids.add(user.uid);
    let holdInFlight = false;
    try {
      await sendEmailVerification(user);
      try {
        this.saveLastAttempt(DateTime.now());
      } catch (err) {
        holdInFlight = true;
        console.warn(
          '[EmailVerificationService] saveLastAttempt failed; holding in-flight cooldown.',
          err,
        );
      }
      return true;
    } finally {
      if (holdInFlight) {
        setTimeout(() => {
          this.inFlightUids.delete(user.uid);
        }, coolDownSeconds * 1000);
      } else {
        this.inFlightUids.delete(user.uid);
      }
    }
  }

  private saveLastAttempt(dt: DateTime): void {
    this.storage.set<string>(VERIFY_EMAIL_STORAGE_KEY, dt.toISO());
  }

  private secondsRemaining(coolDownSeconds: number): number {
    const iso = this.storage.get<string>(VERIFY_EMAIL_STORAGE_KEY);
    if (!iso) {
      return 0;
    }
    const last = DateTime.fromISO(iso);
    if (!last.isValid) {
      return 0;
    }
    const until = last.plus({ seconds: coolDownSeconds });
    const diff = Math.ceil(until.diff(DateTime.now(), 'seconds').seconds);
    return diff > 0 ? diff : 0;
  }
}
