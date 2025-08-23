import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipFooterComponent } from 'src/app/layout';
import { RegisterFormComponent } from 'src/app/pages/register/register-form.component';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

import { EmailVerificationService } from 'src/app/services/email-verification.service';

@UntilDestroy()
@Component({
  selector: 'pip-register-page',
  imports: [CommonModule, PipFooterComponent, RegisterFormComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  standalone: true,
})
export class RegisterPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly emailVerification = inject(EmailVerificationService);
  private readonly router = inject(Router);

  private readonly coolDownSeconds = 300; // 5 minutes
  private readonly vaultPage: PageUrl = 'vault/:id';

  public ngOnInit(): void {
    this.auth.userChanges.pipe(untilDestroyed(this)).subscribe(async (user) => {
      if (!user) {
        return;
      }

      if (!user.emailVerified) {
        try {
          await this.emailVerification.sendIfEligible(
            user.native,
            this.coolDownSeconds,
          );
        } catch (err) {
          console.error('[RegisterPage] sendEmailVerification failed:', err);
        }
        await this.router.navigate(['verify-email' as PageUrl]);
        return;
      }

      const userVault = this.vaultPage.replace(':id', user.uid);
      this.router.navigate([userVault]);
    });
  }
}
