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
    this.selectTab(0);

    // this.tabButtonRefs.forEach((ref, index) => {
    //   const width = ref.nativeElement.offsetWidth;
    //   // eslint-disable-next-line no-console
    //   console.log(`Tab ${index} width:`, width);
    // });
  }

  public selectTab(index: number): void {
    this.activeIndex = index;
    this.tabs.forEach((tab, i) => {
      tab.isActive.set(i === index);
    });
  }
}
