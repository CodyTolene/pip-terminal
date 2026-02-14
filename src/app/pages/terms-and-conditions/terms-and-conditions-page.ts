import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  selector: 'pip-terms-and-conditions-page',
  templateUrl: './terms-and-conditions-page.html',
  imports: [PipFooterComponent, PipTitleComponent],
  styleUrls: ['./terms-and-conditions-page.scss'],
  standalone: true,
})
export class TermsAndConditionsPage {}
