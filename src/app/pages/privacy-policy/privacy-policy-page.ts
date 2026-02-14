import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-privacy-policy-page',
  templateUrl: './privacy-policy-page.html',
  imports: [PipFooterComponent, PipTitleComponent],
  styleUrls: ['./privacy-policy-page.scss'],
  standalone: true,
})
export class PrivacyPolicyPage {}
