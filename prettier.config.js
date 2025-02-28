/** Prettier configuration and options. */
var prettierConfig = {
  $schema: 'https://json.schemastore.org/prettierrc',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'lf',
  experimentalTernaries: false,
  printWidth: 80,
  proseWrap: 'always',
  quoteProps: 'as-needed',
  semi: true,
  singleAttributePerLine: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
  // Order of import declarations
  importOrder: [
    // Angular first.
    '^@angular/(.*)$',
    '^@angular/animations/(.*)$',
    '^@angular/cdk/(.*)$',
    '^@angular/common/(.*)$',
    '^@angular/compiler/(.*)$',
    '^@angular/core/(.*)$',
    '^@angular/forms/(.*)$',
    '^@angular/material/(.*)$',
    '^@angular/material-luxon-adapter/(.*)$',
    '^@angular/platform-browser/(.*)$',
    '^@angular/platform-browser-dynamic/(.*)$',
    '^@angular/router/(.*)$',
    '^@angular/service-worker/(.*)$',
    // Local application files second.
    '^src/app/components/(.*)$',
    '^src/app/constants/(.*)$',
    '^src/app/decorators/(.*)$',
    '^src/app/directives/(.*)$',
    '^src/app/enumerators/(.*)$',
    '^src/app/models/(.*)$',
    '^src/app/pipes/(.*)$',
    '^src/app/services/(.*)$',
    '^src/app/signals/(.*)$',
    '^src/app/styles/(.*)$',
    '^src/app/types/(.*)$',
    '^src/app/utilities/(.*)$',
    // Third-party libraries third.
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = prettierConfig;
