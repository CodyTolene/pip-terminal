export function getJavascriptVersion(): string {
  return `
    (() => {
      let s = require('Storage');
      let l = s.list();
      if (l.includes('VERSION') && l.includes('.bootcde')) return s.read('VERSION');
      return 'unknown';
    })();
  `;
}
