// strip-inline-styles.directive.ts
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  inject,
} from '@angular/core';

interface StripInlineStylesOptions {
  /** Also clean children and future descendants */
  subtree?: boolean;
  /** Keep these CSS properties if present (case-insensitive) */
  exceptProps?: string[];
  /** Skip elements that match any of these selectors */
  skipSelectors?: string[];
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[stripInlineStyles]',
  standalone: true,
})
export class StripInlineStylesDirective implements AfterViewInit, OnDestroy {
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);

  /** Pass `true` or an options object. Default cleans subtree too. */
  @Input('stripInlineStyles')
  public opts: boolean | StripInlineStylesOptions = true;

  private mo?: MutationObserver;

  public ngAfterViewInit(): void {
    const root = this.elRef.nativeElement;
    const options = this.resolve(this.opts);

    // Do an initial sweep
    this.zone.runOutsideAngular(() => {
      this.cleanNode(root, options);
      if (options.subtree) this.cleanDescendants(root, options);

      // Watch for style changes and new nodes
      this.mo = new MutationObserver((recs) => {
        for (const rec of recs) {
          if (rec.type === 'attributes' && rec.attributeName === 'style') {
            this.cleanNode(rec.target as HTMLElement, options);
          } else if (rec.type === 'childList' && options.subtree) {
            rec.addedNodes.forEach((n) => {
              if (n.nodeType === Node.ELEMENT_NODE) {
                this.cleanNode(n as HTMLElement, options);
                this.cleanDescendants(n as HTMLElement, options);
              }
            });
          }
        }
      });

      this.mo.observe(root, {
        attributes: true,
        attributeFilter: ['style'],
        childList: options.subtree,
        subtree: options.subtree,
      });
    });
  }

  public ngOnDestroy(): void {
    this.mo?.disconnect();
  }

  private resolve(
    input: boolean | StripInlineStylesOptions,
  ): Required<StripInlineStylesOptions> {
    const base: Required<StripInlineStylesOptions> = {
      subtree: true,
      exceptProps: [],
      skipSelectors: [],
    };
    if (input === true) return base;
    if (input === false) return { ...base, subtree: false };
    return {
      subtree: input.subtree ?? base.subtree,
      exceptProps: (input.exceptProps ?? []).map((p) => p.toLowerCase().trim()),
      skipSelectors: input.skipSelectors ?? [],
    };
  }

  private shouldSkip(el: Element, skipSelectors: string[]): boolean {
    if (!skipSelectors.length) return false;
    // If the element itself or any ancestor matches a skip selector, skip it
    for (const sel of skipSelectors) {
      if (
        (el as HTMLElement).matches?.(sel) ||
        (el as HTMLElement).closest?.(sel)
      ) {
        return true;
      }
    }
    return false;
  }

  private cleanNode(
    el: HTMLElement,
    opts: Required<StripInlineStylesOptions>,
  ): void {
    if (this.shouldSkip(el, opts.skipSelectors)) return;

    if (!el.hasAttribute('style')) return;

    if (!opts.exceptProps.length) {
      el.removeAttribute('style');
      return;
    }

    // Keep only allowlisted props
    const raw = el.getAttribute('style') || '';
    const keep: string[] = [];
    for (const rule of raw.split(';')) {
      const r = rule.trim();
      if (!r) continue;
      const [prop, ...rest] = r.split(':');
      if (!prop || !rest.length) continue;
      if (opts.exceptProps.includes(prop.trim().toLowerCase())) {
        keep.push(`${prop}:${rest.join(':')}`);
      }
    }
    if (keep.length) el.setAttribute('style', keep.join('; '));
    else el.removeAttribute('style');
  }

  private cleanDescendants(
    root: HTMLElement,
    opts: Required<StripInlineStylesOptions>,
  ): void {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let n = walker.currentNode as HTMLElement;
    while (n) {
      if (n !== root) this.cleanNode(n, opts);
      n = walker.nextNode() as HTMLElement;
    }
  }
}
