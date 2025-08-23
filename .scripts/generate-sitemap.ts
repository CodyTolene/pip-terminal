import * as fs from 'fs';
import * as path from 'path';

import { PAGE_URLS } from '../src/app/routing/page-urls';

const SITE_URL = process.env.SITE_URL ?? 'https://pip-boy.com';
const DIST_DIR = process.env.ANGULAR_DIST_DIR ?? path.join('public');

function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function calcPriority(url: string): string {
  // Home gets top priority, deeper paths slightly less
  if (url === '') return '1.0';
  const depth = url.split('/').length;
  if (depth <= 1) return '0.8';
  if (depth === 2) return '0.6';
  return '0.5';
}

function changefreq(url: string): string {
  if (url.startsWith('3000-mk-v')) return 'weekly';
  return 'monthly';
}

function buildUrls(): string[] {
  return (
    PAGE_URLS
      // Remove catch‑all and dynamic routes like "vault/:id"
      .filter((u) => u !== '**' && !u.includes(':'))
      // Remove any internal only segments if you ever add them later
      .map((u) => u.trim())
  );
}

function generateXml(urls: string[]): string {
  const today = isoDate();
  const items = urls.map((u) => {
    const loc = u ? `${SITE_URL}/${encodeURI(u)}` : `${SITE_URL}/`;
    const priority = calcPriority(u);
    const freq = changefreq(u);
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <changefreq>${freq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    items.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const urls = buildUrls();
  const xml = generateXml(urls);

  ensureDir(DIST_DIR);
  const outFile = path.join(DIST_DIR, 'sitemap.xml');
  fs.writeFileSync(outFile, xml, 'utf8');

  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  fs.writeFileSync(
    robotsPath,
    ['User-agent: *', 'Allow: /', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join(
      '\n',
    ),
    'utf8',
  );

  // eslint-disable-next-line no-console
  console.log(`Generated ${outFile} with ${urls.length} URLs`);
}

main();
