import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTree, MatTreeModule } from '@angular/material/tree';

import { PipButtonComponent } from 'src/app/components/pip-button/pip-button.component';

import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-file-explorer',
  templateUrl: './pip-file-explorer.component.html',
  styleUrls: ['./pip-file-explorer.component.scss'],
  imports: [
    PipButtonComponent,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTreeModule,
  ],
  providers: [],
  standalone: true,
})
export class PipFileExplorerComponent {
  public constructor(private readonly pipFileService: PipFileService) {}

  protected isInitialized = false;

  protected readonly signals = pipSignals;

  protected readonly fileTree = signal<Branch[]>([]);

  protected childrenAccessor(branch: Branch): Branch[] {
    return branch.children ?? [];
  }

  protected getBranchIcon(branch: Branch): string {
    if (branch.type === 'dir') {
      return 'folder_info';
    } else if (branch.name.endsWith('.avi')) {
      return 'video_file'; // videocam
    } else if (branch.name.endsWith('.wav')) {
      return 'audio_file'; // music_note
    } else if (branch.name.endsWith('.js')) {
      return 'description'; // javascript
    } else if (branch.name.endsWith('.json')) {
      return 'description'; // file_json
    } else {
      // Generic file icon
      return 'description';
    }
  }

  protected getSizeDisplay(bytes?: number): string {
    if (bytes === undefined || bytes === null || bytes === 0) {
      return '';
    }

    let display = ` (${bytes} bytes)`;

    if (bytes < 1024) {
      return display;
    }

    const mb = bytes / (1024 * 1024);
    display = mb.toFixed(2);
    if (display !== '0.00') {
      return ` (${display} MB)`;
    }

    const kb = bytes / 1024;
    display = kb.toFixed(2);
    if (display !== '0.00') {
      return ` (${display} KB)`;
    }

    return '';
  }

  protected getTreeIcon(tree: MatTree<Branch>, branch: Branch): string {
    if (tree.isExpanded(branch)) {
      return 'folder_open';
    } else {
      return 'folder';
    }
  }

  protected hasChild(_: number, branch: Branch): boolean {
    return !!branch.children && branch.children.length > 0;
  }

  protected async refresh(): Promise<void> {
    this.isInitialized = false;
    this.signals.disableAllControls.set(true);
    logMessage('Loading file list...');

    const tree = [...(await this.pipFileService.getTree())];
    const sortedTree = this.sortTree(tree);
    this.fileTree.set(sortedTree);

    logMessage('File list loaded successfully.');
    this.signals.disableAllControls.set(false);
    this.isInitialized = true;
  }

  private sortTree(branches: Branch[]): Branch[] {
    branches.sort((a, b) => a.name.localeCompare(b.name));
    for (const branch of branches) {
      if (branch.children) {
        this.sortTree(branch.children);
      }
    }
    return branches;
  }
}
