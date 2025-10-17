import {
  AfterViewInit,
  Directive,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

/**
 * Directive to strip inline styles from an element, if they are added later
 * (e.g. by Google Ads) they will be removed again.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[stripInlineStyles]',
  standalone: true,
})
export class StripInlineStylesDirective implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  private mutationObserver?: MutationObserver;

  public ngAfterViewInit(): void {
    const host = this.elRef.nativeElement;

    this.zone.runOutsideAngular(() => {
      this.removeInlineStyle(host);

      this.mutationObserver = new MutationObserver((recs) => {
        for (const rec of recs) {
          if (rec.type === 'attributes' && rec.attributeName === 'style') {
            this.removeInlineStyle(host);
          }
        }
      });

      this.mutationObserver.observe(host, {
        attributes: true,
        attributeFilter: ['style'],
      });
    });
  }

  public ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
  }

  private removeInlineStyle(el: HTMLElement): void {
    if (el.hasAttribute('style')) {
      el.removeAttribute('style');
    }
  }
}
