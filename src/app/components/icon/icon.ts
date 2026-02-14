import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
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
  templateUrl: './icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon],
  styleUrl: './icon.scss',
  standalone: true,
})
export class PipIconComponent {
  public readonly name = input.required<IconName | IconCustomName>();

  @Input() public ariaLabel?: string;

  @Input() public color?: ThemePalette;

  @Input() public size?: number | string;

  @HostBinding('style.--pip-icon-size')
  protected get iconSize(): string | null {
    if (this.size === null || this.size === undefined || this.size === '') {
      return null;
    }

    return typeof this.size === 'number' ? `${this.size}px` : this.size;
  }

  protected fontIcon: Signal<FontIcon> = computed(() =>
    (iconCustomNames as readonly string[]).includes(this.name())
      ? 'svg'
      : 'font',
  );

  @Input() public fontSet: IconFontSet = 'material-icons';

  @Input({ transform: booleanAttribute }) public inline = false;
}

type FontIcon = 'svg' | 'font';
