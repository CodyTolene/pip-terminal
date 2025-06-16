import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

const appsDir = join(__dirname, '../public/pip/apps');
const outputFile = join(__dirname, '../public/pip/apps.json');

const appDirs = readdirSync(appsDir).filter((dir) => {
  const fullPath = join(appsDir, dir);
  return statSync(fullPath).isDirectory();
});

const apps: object[] = [];

for (const dir of appDirs) {
  const metadataPath = join(appsDir, dir, 'metadata.json');

  if (!existsSync(metadataPath)) {
    console.warn(`Skipping ${dir}, no metadata.json found`);
    continue;
  }

  try {
    const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));
    apps.push(metadata);
  } catch (err) {
    console.error(`Failed to parse metadata for ${dir}:`, err);
  }
}

writeFileSync(outputFile, JSON.stringify(apps, null, 2), 'utf8');
// eslint-disable-next-line no-console
console.log(`Generated apps.json with ${apps.length} entries → ${outputFile}`);
