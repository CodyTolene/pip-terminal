import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-privacy-policy-page',
  templateUrl: './privacy-policy-page.component.html',
  imports: [PipFooterComponent],
  styleUrls: ['./privacy-policy-page.component.scss'],
  standalone: true,
})
export class PrivacyPolicyPageComponent {}
