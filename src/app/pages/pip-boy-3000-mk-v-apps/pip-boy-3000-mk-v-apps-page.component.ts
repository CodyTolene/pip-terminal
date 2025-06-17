import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'pip-boy-3000-mk-v-apps-page',
  templateUrl: './pip-boy-3000-mk-v-apps-page.component.html',
  imports: [CommonModule],
  styleUrl: './pip-boy-3000-mk-v-apps-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVAppsPageComponent {
  public constructor(private sanitizer: DomSanitizer) {
    // Allow the official Pip-Boy Mod Tool to be loaded in an iframe.
    this.safeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl('pip/index.html');
  }

  protected readonly safeUrl: SafeResourceUrl;
}
