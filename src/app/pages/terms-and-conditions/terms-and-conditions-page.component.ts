import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'pip-terms-and-conditions-page',
  templateUrl: './terms-and-conditions-page.component.html',
  imports: [PipFooterComponent, PipTitleComponent],
  styleUrls: ['./terms-and-conditions-page.component.scss'],
  standalone: true,
})
export class TermsAndConditionsPageComponent {}
