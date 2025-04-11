import { isNonEmptyString } from 'src/app/utilities';

export function clearScreen(
  message?: string,
  messageTwo?: string,
  video?: { filename: string; x: number; y: number } | null,
): string {
  return `
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
        ${
          isNonEmptyString(message)
            ? `g.drawString("${message}", g.getWidth() / 2, g.getHeight() ${video ? '- 75' : '/ 2 - 10'});`
            : ''
        }
        ${
          isNonEmptyString(messageTwo)
            ? `g.drawString("${messageTwo}", g.getWidth() / 2, g.getHeight() ${video ? '- 40' : '/ 2 + 20'});`
            : ''
        }
        
        // Video
        ${video ? `Pip.videoStart("${video.filename}", { x: ${video.x}, y: ${video.y} });` : ''}
        
        // Force a display refresh
        g.flip();
      } catch (error) {
        return 'Error: ' + error.message;
      }
    })()
  `;
}
