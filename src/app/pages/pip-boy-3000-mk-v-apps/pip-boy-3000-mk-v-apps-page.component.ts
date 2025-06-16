import { PIP_SCRIPTS, PIP_STYLESHEETS, StylesheetKey } from 'src/app/constants';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

import { ScriptKey } from 'src/app/constants/pip-scripts';

import { ScriptsService } from 'src/app/services/scripts.service';
import { StylesheetsService } from 'src/app/services/stylesheets.service';

@Component({
  selector: 'pip-boy-3000-mk-v-apps-page',
  templateUrl: './pip-boy-3000-mk-v-apps-page.component.html',
  imports: [CommonModule],
  styleUrl: './pip-boy-3000-mk-v-apps-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVAppsPageComponent implements OnDestroy {
  public constructor(
    private scriptsService: ScriptsService,
    private stylesheetsService: StylesheetsService,
  ) {
    const scripts = Object.entries(PIP_SCRIPTS) as Array<[ScriptKey, string]>;
    for (const [name, scriptPath] of scripts) {
      // eslint-disable-next-line no-console
      console.info(`Loading script: ${name}`);
      this.scriptsService.loadScript(scriptPath);
    }
    const stylesheets = Object.entries(PIP_STYLESHEETS) as Array<
      [StylesheetKey, string]
    >;
    for (const [name, scriptPath] of stylesheets) {
      // eslint-disable-next-line no-console
      console.info(`Loading stylesheet: ${name}`);
      this.stylesheetsService.loadStylesheet(scriptPath);
    }
  }

  public ngOnDestroy(): void {
    this.stylesheetsService.unloadAll();
    this.scriptsService.unloadAll();
  }
}
