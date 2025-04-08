export function getBatteryLevel(): string {
  return `
    (() => {
      if (typeof Pip === "undefined") return "Error: Pip object not found.";

      try {
        let batteryVoltage = Pip.measurePin(VBAT_MEAS);
        let minVoltage = 3.0;  // Voltage at 0% battery
        let maxVoltage = 4.2;  // Voltage at 100% battery

        // Calculate battery percentage
        let batteryLevel = Math.min(100, Math.max(0, ((batteryVoltage - minVoltage) / (maxVoltage - minVoltage)) * 100));

        console.log("Battery Voltage:", batteryVoltage.toFixed(2), "V");
        console.log("Battery Level:", batteryLevel.toFixed(0), "%");

        return batteryLevel.toFixed(0);
      } catch (error) {
        return "Battery measurement failed: " + error.message;
      }
    })();
  `;
}
