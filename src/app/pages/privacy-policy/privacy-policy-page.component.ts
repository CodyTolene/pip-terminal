import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'pip-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  imports: [PipFooterComponent, PipTitleComponent],
  styleUrls: ['./privacy-policy-page.component.scss'],
  standalone: true,
})
export class PrivacyPolicyPageComponent {}
