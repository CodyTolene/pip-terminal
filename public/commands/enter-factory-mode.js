(() => {
  try {
    // Activate factory test mode
    factoryTestMode();
    return 'Factory test mode activated.';
  } catch (error) {
    return 'Error: ' + error.message;
  }
})();
