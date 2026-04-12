import './commands';

// Handle GDPR consent
Cypress.on('window:before:load', (win) => {
  win.localStorage.setItem(
    'gdprConsent',
    JSON.stringify({ value: true, expiration: null }),
  );
});
