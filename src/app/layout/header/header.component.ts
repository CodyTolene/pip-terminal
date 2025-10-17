import { filter, map } from 'rxjs';
import { PAGES, RouteResourceId } from 'src/app/routing';
import { AuthService } from 'src/app/services';
import { isNavbarOpenSignal } from 'src/app/signals';
import { isNonEmptyValue, shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './header.component.scss',
  providers: [],
  standalone: true,
})
export class HeaderComponent implements OnDestroy {
  public constructor() {
    effect(() => {
      // Track external changes
      const open = this.isNavbarOpenSignal();
      const target = open ? this.closeLabel : this.menuLabel;

      // Read current without tracking to avoid loops
      const current = untracked(() => this.animatedLabelSignal()).trimEnd();

      if (current !== target) {
        this.animateSwap(current, target);
      }
    });
  }

  private readonly auth = inject(AuthService);

  protected readonly userChanges =
    this.auth.userChanges.pipe(shareSingleReplay());

  protected readonly homeUrl = PAGES['Home'];
  protected readonly isNavbarOpenSignal = isNavbarOpenSignal;

  private readonly vaultUrl = PAGES['My Vault'];
  protected readonly userVaultUrl = this.userChanges.pipe(
    filter(isNonEmptyValue),
    map((user) =>
      this.vaultUrl.replace(':id' satisfies RouteResourceId, user.uid),
    ),
  );

  private timers: number[] = [];

  private readonly closeLabel = 'CLOSE';
  private readonly menuLabel = 'MENU';
  private readonly eraseMs = 45;
  private readonly typeMs = 70;

  protected caretIndex = signal<number>(
    this.isNavbarOpenSignal() ? this.closeLabel.length : this.menuLabel.length,
  );

  private readonly maxCh = Math.max(
    this.menuLabel.length,
    this.closeLabel.length,
  );

  protected readonly animatedLabelSignal = signal<string>(
    this.fixedWidth(
      isNavbarOpenSignal() ? this.closeLabel : this.menuLabel,
      this.maxCh,
    ),
  );

  protected caretClass(): string {
    const n = Math.max(0, Math.min(this.maxCh, this.caretIndex()));
    return `caret-${n}`;
  }

  protected toggleNavbar(): void {
    const isOpen = this.isNavbarOpenSignal();
    this.isNavbarOpenSignal.set(!isOpen);
  }

  /** Animate text backspace, and then typed forward. */
  private animateSwap(fromText: string, toText: string): void {
    this.clearTimers();

    this.animatedLabelSignal.set(this.fixedWidth(fromText, this.maxCh));
    this.caretIndex.set(fromText.length);

    const frames: Array<{ text: string; caret: number; delay: number }> = [];

    // Add erase frames
    for (let i = fromText.length; i > 0; i--) {
      const visible = fromText.slice(0, i - 1);
      frames.push({
        text: this.fixedWidth(visible, this.maxCh),
        caret: i - 1,
        delay: this.eraseMs,
      });
    }

    // Add typing frames
    for (let i = 0; i <= toText.length; i++) {
      const visible = toText.slice(0, i);
      frames.push({
        text: this.fixedWidth(visible, this.maxCh),
        caret: i,
        delay: this.typeMs,
      });
    }

    // Play frames
    const playFramesFrom = (i: number): void => {
      if (i >= frames.length) {
        this.timers = [];
        return;
      }
      const f = frames[i];
      this.animatedLabelSignal.set(f.text);
      this.caretIndex.set(f.caret);
      this.later(() => playFramesFrom(i + 1), f.delay);
    };

    this.later(() => playFramesFrom(0), this.eraseMs);
  }

  /** Clear all active timers. */
  private clearTimers(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
  }

  /** Schedule a function to be called after a delay. */
  private later(fn: () => void, ms: number): void {
    this.timers.push(window.setTimeout(fn, ms));
  }

  /**
   * Fix the width of a text string by clipping it to a maximum length and
   * padding with spaces.
   *
   * @param text The text string to fix.
   * @param total The total width to pad to.
   * @returns The fixed-width text string.
   */
  private fixedWidth(text: string, total: number): string {
    const clipped = text.slice(0, total);
    const right = ' '.repeat(Math.max(0, total - clipped.length));
    return clipped + right;
  }

  public ngOnDestroy(): void {
    this.clearTimers();
  }
}
