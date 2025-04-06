(() => {
  try {
    // Remove any UI
    Pip.remove();
    Pip.removeSubmenu && Pip.removeSubmenu();

    // Stop any existing audio
    if (Pip.audioStop) {
      Pip.audioStop();
    }

    // Stop the radio if it's playing
    if (Pip.radioOn) {
      rd.enable(false);
      Pip.radioOn = false;
    }

    // Clear the screen
    g.clear(1);

    // Set font and align text
    g.setFontMonofonto23();
    g.setFontAlign(0, 0);

    // Message(s)
    if (MESSAGE && MESSAGE.trim()) {
      g.drawString(
        MESSAGE,
        g.getWidth() / 2,
        g.getHeight() - (VIDEO ? 75 : 10),
      );
    }
    if (MESSAGE_TWO && MESSAGE_TWO.trim()) {
      g.drawString(
        MESSAGE_TWO,
        g.getWidth() / 2,
        g.getHeight() - (VIDEO ? 40 : -20),
      );
    }

    // Video
    if (VIDEO) {
      Pip.videoStart(VIDEO.filename, { x: VIDEO.x, y: VIDEO.y });
    }

    // Force a display refresh
    g.flip();
  } catch (error) {
    return 'Error: ' + error.message;
  }
})();
