import { defineConfig } from 'cypress';

const host = process.env['APP_HOST'] ?? 'pip-boy.local';
const port = process.env['APP_PORT'] ?? '4200';

const downloadsFolder = 'cypress/downloads';
const enableScreenshots = true;
const enableVideos = false;
const fixturesFolder = 'cypress/fixtures';
const screenshotsFolder = 'cypress/screenshots';
const videosFolder = 'cypress/videos';
const waitForAnimations = true;

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
    indexHtmlFile: 'cypress/component/index.html',
    screenshotOnRunFailure: enableScreenshots,
    screenshotsFolder,
    specPattern: '**/*.cy.ts',
    // supportFile: "cypress/support/component.ts",
    supportFile: false,
    video: enableVideos,
    videosFolder,
    waitForAnimations,
  },
  e2e: {
    baseUrl: `http://${host}:${port}`,
    downloadsFolder,
    fixturesFolder,
    screenshotOnRunFailure: enableScreenshots,
    screenshotsFolder,
    scrollBehavior: 'center',
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.ts',
    // supportFile: "cypress/support/e2e.ts",
    supportFile: false,
    taskTimeout: 120000,
    videosFolder,
    viewportHeight: 1080,
    viewportWidth: 1920,
    waitForAnimations,
  },
});
