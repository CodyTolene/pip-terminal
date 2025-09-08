import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'ost91w',
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
      // see issue https://github.com/cypress-io/cypress/issues/26456
      webpackConfig: { stats: 'errors-only' },
    },
    specPattern: '**/*.cy.ts',
  },
  e2e: {
    supportFile: false,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
