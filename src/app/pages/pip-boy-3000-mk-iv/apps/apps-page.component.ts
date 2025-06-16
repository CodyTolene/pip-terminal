import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipActionsMiscComponent } from 'src/app/components/companion/actions-misc/pip-actions-misc.component';
import { PipActionsPrimaryComponent } from 'src/app/components/companion/actions-primary/pip-actions-primary.component';
import { PipLogComponent } from 'src/app/components/log/pip-log.component';

@Component({
  selector: 'pip-apps-page',
  templateUrl: './apps-page.component.html',
  imports: [
    CommonModule,
    PipActionsMiscComponent,
    PipActionsPrimaryComponent,
    PipLogComponent,
  ],
  styleUrl: './apps-page.component.scss',
  providers: [],
  standalone: true,
})
export class AppsPageComponent {}
