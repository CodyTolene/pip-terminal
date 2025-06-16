export const PIP_SCRIPTS = {
  uart: 'webtools/uart.js',
  heatshrink: 'webtools/heatshrink.js',
  marked: 'core/lib/marked.min.js',
  espruinotools: 'core/lib/espruinotools.js',
  utils: 'core/js/utils.js',
  ui: 'core/js/ui.js',
  comms: 'core/js/comms.js',
  appinfo: 'core/js/appinfo.js',
  index: 'core/js/index.js',
  loader: 'loader.js',
} as const;

export type ScriptKey = keyof typeof PIP_SCRIPTS;
