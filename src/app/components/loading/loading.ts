import { VaultNumberDirective } from 'src/app/directives';

import {
  AfterContentInit,
  Component,
  ContentChild,
  Input,
  booleanAttribute,
} from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-loading',
  imports: [RouterModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  host: {
    '[class.center]': 'center',
    role: 'status',
    '[attr.aria-live]': 'ariaLive',
  },
  standalone: true,
})
export class LoadingComponent implements AfterContentInit {
  @Input() public ariaLive: 'off' | 'polite' | 'assertive' = 'polite';

  @Input({ transform: booleanAttribute })
  public center = false;

  @ContentChild(VaultNumberDirective)
  public vaultNumberContent?: VaultNumberDirective;

  public hasVaultNumber = false;

  public ngAfterContentInit(): void {
    this.hasVaultNumber = !!this.vaultNumberContent;
  }
}
