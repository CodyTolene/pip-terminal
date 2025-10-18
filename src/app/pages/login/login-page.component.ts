import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipFooterComponent } from 'src/app/layout';
import { LoginFormComponent } from 'src/app/pages/login/login-form.component';
import { RouteResourceId } from 'src/app/routing';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title.component';

import { EmailVerificationService } from 'src/app/services/email-verification.service';

import { PageUrl } from 'src/app/types/page-url';

@UntilDestroy()
@Component({
  selector: 'pip-login-page',
  imports: [
    CommonModule,
    LoginFormComponent,
    PipFooterComponent,
    PipTitleComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  standalone: true,
})
export class LoginPageComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly emailVerification = inject(EmailVerificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly coolDownSeconds = 300; // 5 minutes
  private readonly vaultPage: PageUrl = 'vault/:id';

  public ngOnInit(): void {
    this.auth.userChanges.pipe(untilDestroyed(this)).subscribe(async (user) => {
      if (!user) {
        return;
      }

      // Unverified users are always sent to verify flow
      if (!user.emailVerified) {
        try {
          await this.emailVerification.sendIfEligible(
            user.native,
            this.coolDownSeconds,
          );
        } catch (err) {
          console.error('[LoginPage] sendEmailVerification failed:', err);
        }
        await this.router.navigate(['verify-email' as PageUrl]);
        return;
      }

      // Redirect if a safe return URL is provided
      const safeRedirect = this.getSafeRedirect();
      if (safeRedirect) {
        await this.router.navigateByUrl(safeRedirect);
        return;
      }

      // Default to the user's Vault page
      const userVault = this.vaultPage.replace(
        ':id' satisfies RouteResourceId,
        user.uid,
      );
      this.router.navigate([userVault]);
    });
  }

  private getSafeRedirect(): string | null {
    const qp = this.route.snapshot.queryParamMap;
    const raw = qp.get('returnUrl') ?? qp.get('redirectUrl');
    if (!raw) {
      return null;
    }

    let url = raw.trim();
    try {
      url = decodeURIComponent(url);
    } catch {
      // Ok to ignore
    }

    // Strip CRLF just to be extra safe
    url = url.replace(/[\r\n]/g, '');

    // Disallow absolute URLs
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url) || url.startsWith('//')) {
      return null;
    }

    // Normalize to be relative to root
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }

    // Avoid loops or sus double slashes
    if (
      url.startsWith('/login') ||
      url.startsWith('/verify-email') ||
      url.startsWith('//')
    ) {
      return null;
    }

    // Make sure Angular can parse it
    try {
      this.router.parseUrl(url);
      return url;
    } catch {
      return null;
    }
  }
}
