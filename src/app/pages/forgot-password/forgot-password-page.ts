import { PipFooterComponent } from 'src/app/layout';

import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';

import { ForgotPasswordFormComponent } from './forgot-password-form';

@Component({
  selector: 'pip-forgot-password-page',
  standalone: true,
  imports: [PipFooterComponent, PipTitleComponent, ForgotPasswordFormComponent],
  templateUrl: './forgot-password-page.html',
  styleUrl: './forgot-password-page.scss',
})
export class ForgotPasswordPage {}
