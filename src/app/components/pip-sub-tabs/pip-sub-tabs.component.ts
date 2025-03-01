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
    this.selectTab(0);
  }

  public selectTab(index: number): void {
    this.activeIndex = index;
    this.tabs.forEach((tab, i) => {
      tab.isActive.set(i === index);
    });
  }
}
