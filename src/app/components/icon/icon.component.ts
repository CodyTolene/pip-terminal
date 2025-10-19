import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  booleanAttribute,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'pip-icon[name]',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIcon],
  standalone: true,
  host: {
    class: 'mat-icon',
  },
})
export class PipIconComponent {
  @Input() public ariaLabel?: string;

  @Input() public color?: ThemePalette;

  /**
   * Render mode:
   *  - 'svg'  => uses MatIcon [svgIcon] with the registered name
   *  - 'font' => uses MatIcon [fontIcon]/[fontSet] (Material ligatures)
   */
  @Input() public fontIcon: FontIcon = 'svg';

  @Input() public fontSet: IconFontSet = 'material-icons';

  @Input({ transform: booleanAttribute }) public inline = false;

  /** The icon name. For SVG mode, must be registered in MatIconRegistry. */
  @Input({ required: true }) public name!: string;
}

type FontIcon = 'svg' | 'font';

type IconFontSet =
  | 'material-icons'
  | 'material-icons-outlined'
  | 'material-icons-round'
  | 'material-icons-sharp'
  | 'material-icons-two-tone';
