import { PipFooterComponent } from 'src/app/layout';
import { RegisterFormComponent } from 'src/app/pages/register/register-form.component';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-register-page',
  imports: [CommonModule, PipFooterComponent, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {}
