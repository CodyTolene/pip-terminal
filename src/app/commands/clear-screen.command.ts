export function clearScreen(
  message?: string,
  messageTwo?: string,
  video?: { filename: string; x: number; y: number } | null,
): string {
  return `
    (() => {
      try {
        Pip.remove();
        Pip.removeSubmenu && Pip.removeSubmenu();
        if (Pip.audioStop) Pip.audioStop();
        if (Pip.radioOn) { rd.enable(false); Pip.radioOn = false; }
        g.clear(1);
        g.setFontMonofonto23();
        g.setFontAlign(0, 0);

        if (${JSON.stringify(message ?? '')}.trim()) {
          g.drawString(
            ${JSON.stringify(message ?? '')},
            g.getWidth() / 2,
            g.getHeight() - (${video ? 'true' : 'false'} ? 75 : 10),
          );
        }

        if (${JSON.stringify(messageTwo ?? '')}.trim()) {
          g.drawString(
            ${JSON.stringify(messageTwo ?? '')},
            g.getWidth() / 2,
            g.getHeight() - (${video ? 'true' : 'false'} ? 40 : -20),
          );
        }

        if (${video ? 'true' : 'false'}) {
          Pip.videoStart(${JSON.stringify(video?.filename)}, {
            x: ${video?.x ?? 0},
            y: ${video?.y ?? 0}
          });
        }

        g.flip();
      } catch (error) {
        return 'Error: ' + error.message;
      }
    })();
  `;
}
