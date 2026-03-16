import * as fs from 'fs';
import * as path from 'path';

const SITE_URL = process.env.SITE_URL ?? 'https://pip-boy.com';
const DIST_DIR = process.env.ANGULAR_DIST_DIR ?? path.join('public');
const PAGE_URLS_SOURCE_FILE = path.resolve(
  __dirname,
  '../src/app/routing/page-urls.ts',
);

function extractArrayConstant(source: string, constantName: string): string[] {
  const arrayBlockPattern = new RegExp(
    `export\\s+const\\s+${constantName}[^=]*=\\s*\\[([\\s\\S]*?)\\];`,
    'm',
  );
  const match = source.match(arrayBlockPattern);

  if (!match) {
    throw new Error(
      `Could not find exported array constant "${constantName}" in ${PAGE_URLS_SOURCE_FILE}`,
    );
  }

  const items: string[] = [];
  const entryPattern = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  let entryMatch: RegExpExecArray | null;

  while ((entryMatch = entryPattern.exec(match[1])) !== null) {
    items.push(entryMatch[1]);
  }

  return items;
}

function loadSitemapUrls(): {
  privateSitemapUrls: string[];
  publicSitemapUrls: string[];
} {
  const source = fs.readFileSync(PAGE_URLS_SOURCE_FILE, 'utf8');

  return {
    publicSitemapUrls: extractArrayConstant(source, 'PUBLIC_SITEMAP_URLS'),
    privateSitemapUrls: extractArrayConstant(source, 'PRIVATE_SITEMAP_URLS'),
  };
}

function isoDate(d = new Date()): string {
  return d.toISOString().slice(0, 10); // yyyy-mm-dd
}

function calcPriority(url: string): string {
  // Home is top priority
  if (url === '') return '1.0';

  // Other pages
  const depth = url.split('/').length;
  if (depth <= 1) return '0.8';
  if (depth === 2) return '0.6';
  return '0.5';
}

function changefreq(url: string): string {
  if (url === '') {
    return 'daily';
  }

  if (
    url.startsWith('2000-mk-vi') ||
    url.startsWith('3000') ||
    url.startsWith('3000-mk-iv') ||
    url.startsWith('3000-mk-iv') ||
    url.startsWith('3000-mk-v') ||
    url.startsWith('3000a')
  ) {
    return 'weekly';
  }

  if (url === 'privacy-policy' || url === 'terms-and-conditions') {
    return 'yearly';
  }

  return 'monthly';
}

function buildUrls(publicSitemapUrls: string[]): string[] {
  return (
    publicSitemapUrls
      // Remove catch-all and dynamic routes (like `vault/:id`)
      .filter((u) => u !== '**' && !u.includes(':'))
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
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9',
    '                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">',
    items.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
}

function generateRobotsTxt(privateSitemapUrls: string[]): string {
  return [
    '# Pip-Terminal - robots.txt',
    `# ${SITE_URL}`,
    '',
    '# Allow all crawlers',
    'User-agent: *',
    'Allow: /',
    '',
    '# Disallow internal/private pages',
    ...privateSitemapUrls.map((url) => `Disallow: /${url}`),
    '',
    '# Google-specific optimizations',
    'User-agent: Googlebot',
    'Allow: /',
    'Crawl-delay: 1',
    '',
    '# Bing-specific settings',
    'User-agent: Bingbot',
    'Allow: /',
    'Crawl-delay: 2',
    '',
    '# Sitemap location',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
    '# Host directive (optional for some crawlers)',
    `Host: ${SITE_URL}`,
    '',
  ].join('\n');
}

function ensureDir(dir: string): boolean {
  if (!fs.existsSync(dir)) {
    return fs.mkdirSync(dir, { recursive: true }) !== undefined;
  }

  return true;
}

function main(): void {
  const { publicSitemapUrls, privateSitemapUrls } = loadSitemapUrls();
  const urls = buildUrls(publicSitemapUrls);
  const xml = generateXml(urls);

  ensureDir(DIST_DIR);

  const outFile = path.join(DIST_DIR, 'sitemap.xml');
  fs.writeFileSync(outFile, xml, 'utf8');

  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  fs.writeFileSync(robotsPath, generateRobotsTxt(privateSitemapUrls), 'utf8');

  // eslint-disable-next-line no-console
  console.log(`Generated ${outFile} with ${urls.length} URLs`);
  // eslint-disable-next-line no-console
  console.log(`Generated ${robotsPath}`);
}

main();
