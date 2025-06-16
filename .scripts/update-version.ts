import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Read package.json and package-lock.json
const packageJsonPath = join(__dirname, '../package.json');
const packageLockPath = join(__dirname, '../package-lock.json');
const versionFilePath = join(__dirname, '../src/app/constants/app-version.ts');

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const packageLock = JSON.parse(readFileSync(packageLockPath, 'utf8'));

// Use version from package.json
const version = packageJson.version;

// Update package-lock.json version
packageLock.version = version;

// Update version.ts
const versionContent = `export const APP_VERSION = '${version}';\n`;

writeFileSync(versionFilePath, versionContent, 'utf8');
writeFileSync(
  packageLockPath,
  JSON.stringify(packageLock, null, 2) + '\n',
  'utf8',
);

// eslint-disable-next-line no-console
console.log(
  `Updated "app-version.ts" and "package-lock.json" to version: ${version}`,
);
