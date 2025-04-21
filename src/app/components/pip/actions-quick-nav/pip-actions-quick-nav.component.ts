import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'pip-actions-quick-nav',
  templateUrl: './pip-actions-quick-nav.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-quick-nav.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsQuickNavComponent {
  public constructor(private readonly tabsService: TabsService) {}

  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  @Input() public set disableAppsTab(value: BooleanInput) {
    this.#disableAppsTab = coerceBooleanProperty(value);
  }
  public get disableAppsTab(): boolean {
    return this.#disableAppsTab;
  }
  #disableAppsTab = false;

  @Input() public set disableConnectTab(value: BooleanInput) {
    this.#disableConnectTab = coerceBooleanProperty(value);
  }
  public get disableConnectTab(): boolean {
    return this.#disableConnectTab;
  }
  #disableConnectTab = false;

  @Input() public set disableDiagnosticsSetTab(value: BooleanInput) {
    this.#disableDiagnosticsSetTab = coerceBooleanProperty(value);
  }
  public get disableDiagnosticsSetTab(): boolean {
    return this.#disableDiagnosticsSetTab;
  }
  #disableDiagnosticsSetTab = false;

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

  @Input() public set disableStatsTab(value: BooleanInput) {
    this.#disableStatsTab = coerceBooleanProperty(value);
  }
  public get disableStatsTab(): boolean {
    return this.#disableStatsTab;
  }
  #disableStatsTab = false;

  protected async goToTabs(
    tab: TabLabelEnum,
    subTab: SubTabLabelEnum,
  ): Promise<void> {
    await this.tabsService.switchToTab(tab, subTab);
  }
}
