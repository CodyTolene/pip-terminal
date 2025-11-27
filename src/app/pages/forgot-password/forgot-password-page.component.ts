import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';

@Component({
  selector: 'pip-forgot-password-page',
  standalone: true,
  imports: [PipFooterComponent, PipTitleComponent, ForgotPasswordFormComponent],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {}
