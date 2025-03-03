import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { PipTabComponent } from './pip-tab.component';

@Component({
  selector: 'pip-tabs',
  templateUrl: './pip-tabs.component.html',
  styleUrls: ['./pip-tabs.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipTabsComponent implements AfterViewInit {
  @ContentChildren(PipTabComponent, { descendants: true })
  public readonly tabs!: QueryList<PipTabComponent>;

  @ViewChildren('tabButton', { read: ElementRef })
  public readonly tabButtonRefs!: QueryList<ElementRef<HTMLButtonElement>>;

  public activeIndex = 0;

  public ngAfterViewInit(): void {
    if (this.tabs.length > 0) {
      this.selectTab(0, false);
    }
  }

  public async selectTab(index: number, playSound = true): Promise<void> {
    this.tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.isActive = isActive;
    });

    if (playSound) {
      await this.playTickSound();
    }

    this.activeIndex = index;
  }

  private async playTickSound(): Promise<void> {
    const audio = new Audio('sounds/tick.wav');
    await audio.play();
  }
}
