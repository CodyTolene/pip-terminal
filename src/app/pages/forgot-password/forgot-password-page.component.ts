import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';

/**
 * A simple page wrapper for the forgot password workflow. This page
 * presents explanatory text, the forgot password form, and a footer.
 * The actual business logic resides in the form component.
 */
@Component({
  selector: 'pip-forgot-password-page',
  standalone: true,
  imports: [
    CommonModule,
    PipFooterComponent,
    PipTitleComponent,
    ForgotPasswordFormComponent,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
})
export class ForgotPasswordPageComponent {}
