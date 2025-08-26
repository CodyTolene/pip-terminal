import { VaultNumberDirective } from 'src/app/directives';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  Input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-loading',
  imports: [CommonModule, RouterModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  host: {
    '[class.center]': 'center',
    role: 'status',
    '[attr.aria-live]': 'ariaLive',
  },
  standalone: true,
})
export class LoadingComponent implements AfterContentInit {
  @Input({ required: false })
  public ariaLive: 'off' | 'polite' | 'assertive' = 'polite';

  @Input({ required: false, transform: coerceBooleanProperty })
  public center = false;

  @ContentChild(VaultNumberDirective)
  public vaultNumberContent?: VaultNumberDirective;

  public hasVaultNumber = false;

  public ngAfterContentInit(): void {
    this.hasVaultNumber = !!this.vaultNumberContent;
  }
}
