import { environment } from 'src/environments/environment';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
  inject,
} from '@angular/core';

type AdsByGoogle = unknown[];

@Component({
  selector: 'pip-adsense-unit[adClient][adSlot]',
  standalone: true,
  imports: [CommonModule],
  template: `<ins #adRef class="adsbygoogle" style="display:block"></ins>`,
  styles: [
    `
      :host {
        width: 100%;
        display: block;
      }
      ins {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AdsenseUnitComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);

  @Input({ required: true }) public adClient!: string;

  @Input({ required: true }) public adSlot!: string;

  @Input() public adFormat = 'auto';

  @Input({ transform: coerceBooleanProperty })
  public fullWidthResponsive = true;

  @ViewChild('adRef', { static: true })
  private adRef!: ElementRef<HTMLElement>;

  public ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const el = this.adRef.nativeElement;

    // Set attributes expected by AdSense
    this.renderer.setAttribute(el, 'data-ad-client', this.adClient);
    this.renderer.setAttribute(el, 'data-ad-slot', this.adSlot);
    this.renderer.setAttribute(el, 'data-ad-format', this.adFormat);
    this.renderer.setAttribute(
      el,
      'data-full-width-responsive',
      this.fullWidthResponsive ? 'true' : 'false',
    );
    if (environment.isProduction === false) {
      this.renderer.setAttribute(el, 'data-adtest', 'on');
    }

    if (el.getAttribute('data-adsbygoogle-status')) {
      return;
    }

    const w = window as unknown as { adsbygoogle?: AdsByGoogle };
    w.adsbygoogle = w.adsbygoogle ?? [];
    try {
      w.adsbygoogle.push({});
    } catch {
      // TODO: Show message to user that ads could not be loaded
      console.error('Ads could not be loaded');
    }
  }
}
