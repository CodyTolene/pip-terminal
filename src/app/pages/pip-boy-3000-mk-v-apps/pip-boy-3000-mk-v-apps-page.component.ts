import { PIP_SCRIPTS } from 'src/app/constants';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

import { ScriptKey } from 'src/app/constants/pip-scripts';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-apps-page',
  templateUrl: './pip-boy-3000-mk-v-apps-page.component.html',
  imports: [CommonModule],
  styleUrl: './pip-boy-3000-mk-v-apps-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVAppsPageComponent implements OnDestroy {
  public constructor(private scriptsService: ScriptsService) {
    const entries = Object.entries(PIP_SCRIPTS) as Array<[ScriptKey, string]>;
    for (const [name, scriptPath] of entries) {
      // eslint-disable-next-line no-console
      console.info(`Loading script: ${name}`);
      this.scriptsService.loadScript(scriptPath);
    }
  }

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
  }
}
