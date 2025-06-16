import { PIP_SCRIPTS } from 'src/app/constants';
import { PipCompanionUrlsEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { ScriptKey } from 'src/app/constants/pip-scripts';

import { ScriptsService } from 'src/app/services/scripts.service';

@Component({
  selector: 'pip-boy-3000-mk-v-companion-page',
  templateUrl: './pip-boy-3000-mk-v-companion-page.component.html',
  imports: [CommonModule, MatExpansionModule, RouterModule],
  styleUrl: './pip-boy-3000-mk-v-companion-page.component.scss',
  standalone: true,
})
export class PipBoy3000MkVCompanionPageComponent implements OnDestroy {
  public constructor(private scriptsService: ScriptsService) {
    const scriptKey: ScriptKey = 'uart';
    this.scriptsService.loadScript(PIP_SCRIPTS[scriptKey]);
  }

  protected readonly PipCompanionUrlsEnum = PipCompanionUrlsEnum;

  public ngOnDestroy(): void {
    this.scriptsService.unloadAll();
  }
}
