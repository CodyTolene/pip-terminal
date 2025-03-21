import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipActionsLaunchGameComponent } from 'src/app/components/pip-actions-launch-game/pip-actions-launch-game.component';
import { PipActionsPrimaryComponent } from 'src/app/components/pip-actions-primary/pip-actions-primary.component';
import { PipActionsQuickNavComponent } from 'src/app/components/pip-actions-quick-nav/pip-actions-quick-nav.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

@Component({
  selector: 'pip-games',
  templateUrl: './pip-games.component.html',
  imports: [
    CommonModule,
    PipActionsLaunchGameComponent,
    PipActionsPrimaryComponent,
    PipActionsQuickNavComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-games.component.scss',
  providers: [],
  standalone: true,
})
export class PipGamesComponent {}
