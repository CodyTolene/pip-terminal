import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, booleanAttribute } from '@angular/core';

@Component({
  selector: 'pip-title',
  templateUrl: './title.component.html',
  imports: [CommonModule],
  styleUrl: './title.component.scss',
  providers: [],
  standalone: true,
})
export class PipTitleComponent implements OnInit {
  @Input({ transform: booleanAttribute })
  public h1 = false;

  @Input({ transform: booleanAttribute })
  public h2 = false;

  @Input({ transform: booleanAttribute })
  public h3 = false;

  @Input({ transform: booleanAttribute })
  public h4 = false;

  @Input({ transform: booleanAttribute })
  public h5 = false;

  @Input({ transform: booleanAttribute })
  public h6 = false;

  public ngOnInit(): void {
    const sizes = [this.h1, this.h2, this.h3, this.h4, this.h5, this.h6];
    const trueSizes = sizes.filter((level) => level);
    if (trueSizes.length > 1) {
      throw new Error(
        'Only one of h1, h2, h3, h4, h5, or h6 can be true at a time.',
      );
    }
  }
}
