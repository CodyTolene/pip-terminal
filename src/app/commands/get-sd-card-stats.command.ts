export function getSDCardStats(): string {
  return `
    (() => {
      try {
        let fs = require('fs');
        let stats = fs.getFree();
        let freeMb = (stats.freeSectors * stats.sectorSize) / 1e6;
        let totalMb = (stats.totalSectors * stats.sectorSize) / 1e6;

        return JSON.stringify({ totalMb: totalMb.toFixed(0), freeMb: freeMb.toFixed(0) });
      } catch (error) {
        return "SD card space check failed: " + error.message;
      }
    })();
  `;
}
