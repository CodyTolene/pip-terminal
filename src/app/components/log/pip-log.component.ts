import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { ScreenSizeEnum } from 'src/app/enums';
import { pipSignals } from 'src/app/signals';
import { clearLog, shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostBinding,
  OnInit,
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
})
export class PipLogComponent implements OnInit, AfterViewChecked {
  private readonly elementRef = inject(ElementRef);
  private readonly screenService = inject(ScreenService);

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
    this.screenSizeChanges
      .pipe(untilDestroyed(this))
      .subscribe((screenSize) => {
        if (screenSize !== this.previousScreenSize) {
          this.isCollapsed.set(screenSize !== 'desktop');
          this.previousScreenSize = screenSize;
        }
      });
  }

  public ngAfterViewChecked(): void {
    const logMessages = this.signals.logMessages();

    if (!this.isCollapsed() && logMessages.length > this.previousLogLength) {
      this.scrollToBottom();
    }

    this.previousLogLength = logMessages.length;
  }

  protected clearLog(): void {
    clearLog();
  }

  protected toggleCollapsed(): void {
    this.isCollapsed.update((value) => !value);
  }

  private scrollToBottom(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
