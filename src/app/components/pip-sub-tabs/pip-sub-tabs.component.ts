import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { PipSubTabComponent } from './pip-sub-tab.component';

@Component({
  selector: 'pip-sub-tabs',
  templateUrl: './pip-sub-tabs.component.html',
  styleUrls: ['./pip-sub-tabs.component.scss'],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipSubTabsComponent implements AfterViewInit {
  @ContentChildren(PipSubTabComponent, { descendants: true })
  public readonly tabs!: QueryList<PipSubTabComponent>;

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
      tab.isActive.set(i === index);
    });

    if (playSound) {
      await this.playTickSound();
    }

    this.activeIndex = index;
  }

  private async playTickSound(): Promise<void> {
    const audio = new Audio('sounds/tick-2.wav');
    await audio.play();
  }
}
