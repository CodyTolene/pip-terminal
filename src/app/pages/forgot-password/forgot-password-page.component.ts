import { PipFooterComponent } from 'src/app/layout';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

import { ForgotPasswordFormComponent } from './forgot-password-form.component';

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
