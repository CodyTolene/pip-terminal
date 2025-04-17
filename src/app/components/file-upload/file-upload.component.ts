import { InputDirective } from '@proangular/pro-form';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'pip-file-upload',
  templateUrl: './file-upload.component.html',
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  styleUrl: './file-upload.component.scss',
  standalone: true,
})
export class PipFileUploadComponent extends InputDirective<FileList | null> {
  /** The file type that the input should accept. */
  @Input({ required: true }) public accept: readonly AcceptableFileType[] = [];

  public override readonly id = `file-upload-${++uniqueFileUploadId}`;

  @Input() public set multiple(value: BooleanInput) {
    this.#multiple = coerceBooleanProperty(value);
  }
  public get multiple(): boolean {
    return this.#multiple;
  }
  #multiple = false;

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.formControl.setValue(input.files);
    } else {
      this.formControl.setValue(null);
    }
  }
}

/**
 * A unique ID for each file upload input. This increments by one for each new
 * file upload input created during the lifetime of the application.
 */
let uniqueFileUploadId = 0;

type AcceptableFileType = '.wav' | '.zip';
