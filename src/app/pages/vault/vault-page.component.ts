import { PipFooterComponent } from 'src/app/layout';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'pip-vault-page',
  templateUrl: './vault-page.component.html',
  imports: [CommonModule, PipFooterComponent],
  styleUrls: ['./vault-page.component.scss'],
  standalone: true,
})
export class VaultPageComponent {
  private readonly auth = inject(AuthService);

  protected readonly userChanges = this.auth.userChanges;
}
