import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PipConnectionService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-connection.service';

@Component({
  selector: 'pip-boy-3000-mk-v-apps-page',
  templateUrl: './pip-boy-3000-mk-v-apps-page.component.html',
  imports: [],
  styleUrl: './pip-boy-3000-mk-v-apps-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVAppsPageComponent implements OnInit {
  public constructor() {
    // Allow the official Pip-Boy Mod Tool to be loaded in an iframe.
    this.safeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl('pip/index.html');
  }

  private readonly pipConnectionService = inject(PipConnectionService);
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly safeUrl: SafeResourceUrl;

  public async ngOnInit(): Promise<void> {
    // Disconnect from the Pip-Boy if there's an active connection
    if (this.pipConnectionService.connection?.isOpen) {
      await this.pipConnectionService.disconnect();
    }
  }
}
