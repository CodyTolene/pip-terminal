import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { PipConnectionService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-connection.service';

@Component({
  selector: 'pip-boy-3000-mk-v-apps-page',
  templateUrl: './pip-boy-3000-mk-v-apps-page.component.html',
  imports: [CommonModule],
  styleUrl: './pip-boy-3000-mk-v-apps-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVAppsPageComponent implements OnInit {
  public constructor(
    private readonly pipConnectionService: PipConnectionService,
    private readonly sanitizer: DomSanitizer,
  ) {
    // Allow the official Pip-Boy Mod Tool to be loaded in an iframe.
    this.safeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl('pip/index.html');
  }

  protected readonly safeUrl: SafeResourceUrl;

  public async ngOnInit(): Promise<void> {
    if (this.pipConnectionService.connection?.isOpen) {
      await this.pipConnectionService.disconnect();
    }
  }
}
