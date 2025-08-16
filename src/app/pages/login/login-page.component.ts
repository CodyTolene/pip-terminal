import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipFooterComponent } from 'src/app/layout';
import { LoginFormComponent } from 'src/app/pages/login/login-form.component';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@UntilDestroy()
@Component({
  selector: 'pip-login-page',
  imports: [CommonModule, LoginFormComponent, PipFooterComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  standalone: true,
})
export class LoginPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly homePage: PageUrl = '';

  public ngOnInit(): void {
    this.auth.userChanges.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.router.navigate([this.homePage]);
      }
    });
  }
}
