import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

@Component({
  selector: 'pip-actions-quick-nav',
  templateUrl: './pip-actions-quick-nav.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-quick-nav.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsQuickNavComponent {
  public constructor(private readonly pipTabsService: PipTabsService) {}

  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;

  @Input() public set disableConnectTab(value: BooleanInput) {
    this.#disableConnectTab = coerceBooleanProperty(value);
  }
  public get disableConnectTab(): boolean {
    return this.#disableConnectTab;
  }
  #disableConnectTab = false;

  @Input() public set disableGamesTab(value: BooleanInput) {
    this.#disableGamesTab = coerceBooleanProperty(value);
  }
  public get disableGamesTab(): boolean {
    return this.#disableGamesTab;
  }
  #disableGamesTab = false;

  @Input() public set disableMaintenanceTab(value: BooleanInput) {
    this.#disableMaintenanceTab = coerceBooleanProperty(value);
  }
  public get disableMaintenanceTab(): boolean {
    return this.#disableMaintenanceTab;
  }
  #disableMaintenanceTab = false;

  @Input() public set disableRadioSetTab(value: BooleanInput) {
    this.#disableRadioSetTab = coerceBooleanProperty(value);
  }
  public get disableRadioSetTab(): boolean {
    return this.#disableRadioSetTab;
  }
  #disableRadioSetTab = false;

  protected async goToTabs(
    tab: PipTabLabelEnum,
    subTab: PipSubTabLabelEnum,
  ): Promise<void> {
    await this.pipTabsService.switchToTab(tab, subTab, {
      playMainTabSound: true,
      playSubTabSound: true,
    });
  }
}
