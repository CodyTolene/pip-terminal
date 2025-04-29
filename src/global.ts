/** To be used with `public/scripts/uart.js`. */

export {};

declare global {
  const UART: UartStatic;

  interface Window {
    ['ga-disable-G-XXXXXXXXXX']?: boolean;
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
