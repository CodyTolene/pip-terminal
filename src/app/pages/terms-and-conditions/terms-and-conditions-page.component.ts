import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-terms-and-conditions-page',
  templateUrl: './terms-and-conditions-page.component.html',
  imports: [PipFooterComponent],
  styleUrls: ['./terms-and-conditions-page.component.scss'],
  standalone: true,
})
export class TermsAndConditionsPageComponent {}
