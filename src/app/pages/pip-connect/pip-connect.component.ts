import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { PipActionsConnectionComponent } from 'src/app/components/pip-actions-connection/pip-actions-connection.component';
import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-connect',
  templateUrl: './pip-connect.component.html',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    PipActionsConnectionComponent,
    PipLogComponent,
  ],
  styleUrl: './pip-connect.component.scss',
  standalone: true,
})
export class PipConnectComponent implements OnInit {
  protected ownerName: string | null = null;
  protected selectedFile: File | null = null;

  protected readonly signals = pipSignals;

  public ngOnInit(): void {
    logMessage('Initialized Pip Terminal');
    logMessage('Ready to connect');
    logMessage(
      'Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, ' +
        'and brand names are the property of their respective owners. This ' +
        'project is for personal use only and is not intended for commercial ' +
        'purposes. Use of any materials is at your own risk.',
    );
  }
}
