import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReplaySubject, map } from 'rxjs';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';

import { PipButtonComponent } from 'src/app/components/pip-button/pip-button.component';

import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
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
export class PipFileExplorerComponent implements OnInit {
  public constructor(private readonly pipFileService: PipFileService) {}

  protected isInitialized = false;

  protected readonly signals = pipSignals;

  protected readonly fileTree = signal<FileNode[]>([]);

  private readonly fileMetaListSubject = new ReplaySubject<DirMeta[]>(1);
  private readonly fileMetaListChanges = this.fileMetaListSubject
    .asObservable()
    .pipe(
      map((fileMetaList): FileNode[] => {
        const rootMap = new Map<string, FileNode>();

        for (const entry of fileMetaList) {
          const segments = entry.path.split('/').filter(Boolean);
          let currentMap = rootMap;
          let parentNode: FileNode | undefined;

          segments.forEach((segment, index) => {
            const fullPath = '/' + segments.slice(0, index + 1).join('/');

            if (!currentMap.has(segment)) {
              const isFile =
                index === segments.length - 1 && entry.type === 'file';
              const newNode: FileNode = {
                name: segment,
                path: fullPath,
                type: isFile ? 'file' : 'dir',
              };

              currentMap.set(segment, newNode);

              if (parentNode) {
                parentNode.children ??= [];
                parentNode.children.push(newNode);
              }
            }

            parentNode = currentMap.get(segment)!;
            currentMap = new Map(
              parentNode.children?.map((child) => [child.name, child]) ?? [],
            );
          });
        }

        const tree = Array.from(rootMap.values());
        this.sortTree(tree);
        return tree;
      }),
    );

  public ngOnInit(): void {
    this.fileMetaListChanges
      .pipe(untilDestroyed(this))
      .subscribe((fileMetaList) => {
        this.fileTree.set(fileMetaList);
      });
  }

  protected readonly childrenAccessor = (node: FileNode): FileNode[] =>
    node.children ?? [];

  protected readonly hasChild = (_: number, node: FileNode): boolean =>
    !!node.children && node.children.length > 0;

  protected async refresh(): Promise<void> {
    this.isInitialized = false;
    this.signals.disableAllControls.set(true);
    logMessage('Loading file list...');

    const fileMetaList = await this.pipFileService.getAllDirectoryContents();
    this.fileMetaListSubject.next([...fileMetaList]);

    logMessage('File list loaded successfully.');
    this.signals.disableAllControls.set(false);
    this.isInitialized = true;
  }

  private sortTree(nodes: FileNode[]): void {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    for (const node of nodes) {
      if (node.children) {
        this.sortTree(node.children);
      }
    }
  }
}

interface FileNode extends DirMeta {
  children?: FileNode[];
}
