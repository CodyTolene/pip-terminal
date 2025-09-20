import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipFileService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { logMessage } from 'src/app/utilities';

import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTree, MatTreeModule } from '@angular/material/tree';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

import { Branch } from 'src/app/types/branch';

@UntilDestroy()
@Component({
  selector: 'pip-file-explorer',
  templateUrl: './pip-file-explorer.component.html',
  styleUrls: ['./pip-file-explorer.component.scss'],
  imports: [
    PipButtonComponent,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTreeModule,
  ],
  providers: [],
  standalone: true,
})
export class PipFileExplorerComponent {
  private readonly dialog = inject(MatDialog);
  private readonly pipFileService = inject(PipFileService);

  protected isInitialized = false;

  protected readonly signals = pipSignals;

  protected readonly fileTree = signal<Branch[]>([]);

  protected childrenAccessor(branch: Branch): Branch[] {
    return branch.children ?? [];
  }

  protected async deleteDirectory(branch: Branch): Promise<void> {
    const result = await this.pipFileService.deleteDirectoryOnDevice(
      branch.path,
    );
    if (result.success) {
      logMessage(`Directory "${branch.path}" deleted successfully.`);
      const tree = [...this.fileTree()];
      this.removeBranchByPath(tree, branch.path);
      this.fileTree.set(tree);
    } else {
      logMessage(`Failed to delete directory ${branch.path}.`);
    }
  }

  protected async deleteFile(branch: Branch): Promise<void> {
    if (this.signals.disableAllControls()) {
      return;
    }

    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to delete "${branch.path}" from the device?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldDelete) => {
        if (!shouldDelete) return;

        this.signals.disableAllControls.set(true);

        const success = await this.pipFileService.deleteFileOnDevice(
          branch.path,
        );

        this.signals.disableAllControls.set(false);

        if (success) {
          logMessage(`File "${branch.path}" deleted successfully.`);
          // Delete the file from the tree
          const tree = [...this.fileTree()];
          this.removeBranchByPath(tree, branch.path);
          this.fileTree.set(tree);
        } else {
          logMessage(`Failed to delete file ${branch.path}.`);
        }
      });
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
    if (this.signals.disableAllControls() || this.signals.isUploadingFile()) {
      return;
    }

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

  private removeBranchByPath(tree: Branch[], targetPath: string): boolean {
    for (let i = 0; i < tree.length; i++) {
      const branch = tree[i];

      // Match found at this level
      if (branch.path === targetPath) {
        tree.splice(i, 1);
        return true;
      }

      // Check deeper if dir
      if (branch.children?.length) {
        const removed = this.removeBranchByPath(branch.children, targetPath);

        // If child removed dir is now empty, remove
        if (removed && branch.children.length === 0) {
          delete branch.children;
        }

        if (removed) return true;
      }
    }

    return false;
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
