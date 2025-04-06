(() => {
  try {
    // Delay slightly and restart the device
    setTimeout(() => {
      E.reboot();
    }, TIMEOUT_MS);
  } catch (error) {
    return 'Error: ' + error.message;
  }
})();
