import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

// Fetch Material Icons names list and write them to a TypeScript file
async function getMatIcons(): Promise<void> {
  const url =
    'https://raw.githubusercontent.com/google/material-design-icons/master/font/MaterialIcons-Regular.codepoints';
  const outputPath = 'src/app/components/icon/icon-names.ts';

  try {
    const response = await axios.get(url);
    const iconNames = response.data
      .split('\n')
      .map((line: string) => line.split(' ')[0].trim())
      .filter(Boolean);

    const output = `export const iconNames = [\n  '${iconNames.join(`',\n  '`)}'\n] as const;`;

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, output);

    // eslint-disable-next-line no-console
    console.log(`Saved ${iconNames.length} icon names to "${outputPath}"`);
  } catch (err) {
    console.error('Failed to fetch or write icon names:', err);
  }
}

getMatIcons();
