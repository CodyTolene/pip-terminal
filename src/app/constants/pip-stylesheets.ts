export const PIP_STYLESHEETS = {
  spectre: 'css/spectre.min.css',
  'spectre-exp': 'css/spectre-exp.min.css',
  'spectre-icons': 'css/spectre-icons.min.css',
  main: 'css/main.css',
} as const;

export type StylesheetKey = keyof typeof PIP_STYLESHEETS;
