import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { ScreenSizeEnum } from 'src/app/enums';
import { pipSignals } from 'src/app/signals';
import { clearLog, shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { ScreenService } from 'src/app/services/screen.service';

@UntilDestroy()
@Component({
  selector: 'pip-log',
  templateUrl: './pip-log.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-log.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipLogComponent implements OnInit, AfterViewChecked {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly screenService = inject(ScreenService);

  @ViewChild('scroller') private scroller?: ElementRef<HTMLDivElement>;
  @ViewChild('bottom') private bottom?: ElementRef<HTMLElement>;

  protected readonly screenSizeChanges =
    this.screenService.screenSizeChanges.pipe(shareSingleReplay());

  protected readonly isCollapsed = signal<boolean>(false);
  protected readonly signals = pipSignals;

  private previousScreenSize: ScreenSizeEnum | null = null;
  private previousLogLength = 0;

  @HostBinding('class.collapsed')
  public get collapsedClass(): boolean {
    return this.isCollapsed();
  }

  @HostBinding('attr.aria-expanded')
  public ariaExpanded(): string {
    return String(!this.isCollapsed());
  }

  public async ngOnInit(): Promise<void> {
    const screenSize = await firstValueFrom(this.screenSizeChanges);
    if (screenSize !== 'desktop') {
      this.isCollapsed.set(true);
    }

    this.previousScreenSize = screenSize;
    this.screenSizeChanges.pipe(untilDestroyed(this)).subscribe((size) => {
      if (size !== this.previousScreenSize) {
        const nextCollapsed = size !== 'desktop';
        this.isCollapsed.set(nextCollapsed);
        this.previousScreenSize = size;

        // If we just expanded due to screen-size change, wait a tick then scroll
        if (!nextCollapsed) {
          this.deferScroll();
        }
      }
    });
  }

  public ngAfterViewChecked(): void {
    const logMessages = this.signals.logMessages();

    // When new entries are added and not collapsed, scroll now
    if (!this.isCollapsed() && logMessages.length > this.previousLogLength) {
      this.scrollToBottom();
    }

    this.previousLogLength = logMessages.length;
  }

  protected clearLog(): void {
    clearLog();
    // After clearing, the DOM changes; defer scrolling one tick
    this.deferScroll();
  }

  protected toggleCollapsed(): void {
    this.isCollapsed.update((value) => {
      const next = !value;
      // If expanding, DOM will re-render -> defer scrolling one tick
      if (!next) {
        this.deferScroll();
      }
      return next;
    });
  }

  /** Defer scrolling until after the DOM has updated. */
  private deferScroll(): void {
    setTimeout(() => this.scrollToBottom());
  }

  private scrollToBottom(debug = true): void {
    const toTop = this.isCollapsed();

    const isScrollable = (el: HTMLElement | null | undefined): boolean =>
      !!el && el.scrollHeight > el.clientHeight + 1;

    const log = (...args: unknown[]): void => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('[PipLog scroll]', ...args);
      }
    };

    const container = this.scroller?.nativeElement ?? null;
    if (container) {
      if (toTop) {
        const before = container.scrollTop;
        container.scrollTop = 0;
        log('container -> top', { before, after: container.scrollTop });
        return;
      } else if (isScrollable(container)) {
        const before = container.scrollTop;
        container.scrollTop = container.scrollHeight;
        log('container -> bottom', {
          before,
          after: container.scrollTop,
          clientHeight: container.clientHeight,
          scrollHeight: container.scrollHeight,
        });
        return;
      } else {
        log('container exists but not scrollable, falling through', {
          clientHeight: container.clientHeight,
          scrollHeight: container.scrollHeight,
        });
      }
    } else {
      log('no container, falling through to anchor/host');
    }

    // Fallback: use the bottom anchor if it exists
    const bottomEl = this.bottom?.nativeElement ?? null;
    if (!toTop && bottomEl) {
      bottomEl.scrollIntoView({ block: 'end' });
      log('anchor -> bottom via scrollIntoView');
      return;
    }

    // Last resort: scroll the host if it is the scroller
    const host = this.elementRef.nativeElement;
    if (host) {
      if (toTop) {
        if (isScrollable(host)) {
          const before = host.scrollTop;
          host.scrollTop = 0;
          log('host -> top', { before, after: host.scrollTop });
        } else {
          host.scrollIntoView({ block: 'start' });
          log('host -> top via scrollIntoView');
        }
        return;
      } else if (isScrollable(host)) {
        const before = host.scrollTop;
        host.scrollTop = host.scrollHeight;
        log('host -> bottom', {
          before,
          after: host.scrollTop,
          clientHeight: host.clientHeight,
          scrollHeight: host.scrollHeight,
        });
      } else {
        log('host not scrollable, nothing to do', {
          clientHeight: host.clientHeight,
          scrollHeight: host.scrollHeight,
        });
      }
    }
  }
}
