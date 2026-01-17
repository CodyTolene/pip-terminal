import { defineConfig } from 'cypress';

const isCI = !!process.env['CI'];
const host = process.env['APP_HOST'] ?? (isCI ? 'localhost' : 'pip-boy.local');
const port = process.env['APP_PORT'] ?? '4200';
const baseUrl = isCI ? `http://${host}:${port}` : `https://${host}:${port}`;

const downloadsFolder = 'cypress/downloads';
const enableScreenshots = true;
const enableVideos = !isCI; // Local only (not CI)
const fixturesFolder = 'cypress/fixtures';
const screenshotsFolder = 'cypress/screenshots';
const videosFolder = 'cypress/videos';
const waitForAnimations = true;

// Chromium flags that avoid DBus/GPU/sandbox issues in CI
const chromiumFlags = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--disable-setuid-sandbox',
  '--disable-features=UseOzonePlatform,VizDisplayCompositor',
  '--remote-debugging-port=0',
];

export default defineConfig({
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      // see issue https://github.com/cypress-io/cypress/issues/26456
      webpackConfig: { stats: 'errors-only' },
    },
    downloadsFolder,
    fixturesFolder,
    indexHtmlFile: 'cypress/support/component-index.html',
    screenshotOnRunFailure: enableScreenshots,
    screenshotsFolder,
    specPattern: '**/*.cy.ts',
    supportFile: 'cypress/support/component.ts',
    video: enableVideos,
    videosFolder,
    waitForAnimations,
  },

  e2e: {
    baseUrl,
    downloadsFolder,
    fixturesFolder,
    screenshotOnRunFailure: enableScreenshots,
    screenshotsFolder,
    scrollBehavior: 'center',
    setupNodeEvents(on, config) {
      if (isCI) {
        on('before:browser:launch', (browser, launchOptions) => {
          const isChromiumFamily =
            browser?.family === 'chromium' ||
            browser?.name === 'chrome' ||
            browser?.name === 'chromium' ||
            browser?.name === 'edge';
          if (isChromiumFamily) {
            launchOptions.args.push(...chromiumFlags);
          }
          return launchOptions;
        });
      }
      return config;
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    taskTimeout: 120000,
    videosFolder,
    viewportHeight: 1080,
    viewportWidth: 1920,
    waitForAnimations,
  },
});
