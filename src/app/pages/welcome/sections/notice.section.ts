import { Component } from '@angular/core';

import { PipPanelComponent } from 'src/app/components/panel/panel.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-notice]',
  template: `
    <pip-panel>
      <h3>Notice</h3>
      <p>
        Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, and
        brand names are the property of their respective owners. This project is
        for personal use only and is not intended for commercial purposes. Use
        of any materials is at your own risk.
      </p>
    </pip-panel>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipPanelComponent],
})
export class WelcomeNoticeSection {}
