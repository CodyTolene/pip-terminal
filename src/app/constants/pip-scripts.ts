export const PIP_SCRIPTS = {
  uart: 'pip/webtools/uart.js',
  heatshrink: 'pip/webtools/heatshrink.js',
  marked: 'pip/core/lib/marked.min.js',
  espruinotools: 'pip/core/lib/espruinotools.js',
  utils: 'pip/core/js/utils.js',
  ui: 'pip/core/js/ui.js',
  comms: 'pip/core/js/comms.js',
  appinfo: 'pip/core/js/appinfo.js',
  index: 'pip/core/js/index.js',
} as const;

export type ScriptKey = keyof typeof PIP_SCRIPTS;
