export function setAlarmTime(
  timestampSeconds: number,
  timezoneOffsetMinutes: number,
): string {
  // TODO
  const timezoneOffset = timezoneOffsetMinutes / 60;
  return `
    (() => {
      // try {
      //   setTime(${timestampSeconds});
      //   E.setTimeZone(${timezoneOffset});
      //   settings.timezone = ${timezoneOffset};
      //   settings.century = 20;
      //   saveSettings();
      //   tm0 = null;
      //   if (typeof drawFooter === 'function') drawFooter();
      //   return { success: true };
      // } catch (e) {
      //   return {
      //     message: e || 'Failed to set time.',
      //     success: false
      //   };
      // }
    })();
  `;
}
