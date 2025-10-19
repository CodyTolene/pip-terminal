import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

import { iconCustomNames } from 'src/app/components/icon/icon-custom-names';

import { IconCustomName } from 'src/app/types/icon-custom-name';
import { IconFontSet } from 'src/app/types/icon-font-set';
import { IconName } from 'src/app/types/icon-name';

@Component({
  selector: 'pip-icon[name]',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIcon],
  standalone: true,
  host: { class: 'mat-icon' },
})
export class PipIconComponent {
  public readonly name = input.required<IconName | IconCustomName>();

  @Input() public ariaLabel?: string;

  @Input() public color?: ThemePalette;

  protected fontIcon: Signal<FontIcon> = computed(() =>
    (iconCustomNames as readonly string[]).includes(this.name())
      ? 'svg'
      : 'font',
  );

  @Input() public fontSet: IconFontSet = 'material-icons';

  @Input({ transform: booleanAttribute }) public inline = false;
}

type FontIcon = 'svg' | 'font';
