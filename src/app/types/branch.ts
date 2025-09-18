/**
 * A branch in the file system, representing a directory or a file. It
 * contains information about the name, path, type (file or directory), size,
 * modification date, and any child nodes (if it's a directory).
 */
export interface Branch {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  modified?: string;
  children?: Branch[];
}
