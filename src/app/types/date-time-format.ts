export type DateTimeFormat =
  | 'MM/dd/yyyy' // 01/01/2025
  | 'MM/dd/yyyy, hh:mm a (ZZZZ)' // 01/01/2025, 01:00 AM (CDT)
  | 'MM/dd/yyyy, hh:mm a' // 01/01/2025, 01:00 AM
  | 'a' // AM
  | 'ccc, LLLL dd, yyyy hh:mm a' // Wed, November 12, 2023 06:00 AM
  | 'h' // 1
  | 'h:mm a (ZZZZ)' // 1:00 AM (CDT)
  | 'hh' // 01
  | 'hh:mm a' // 01:00 AM
  | 'hh:mm' // 01:00
  | 'mm a' // 00 AM
  | 'mm' // 00
  | 'yyyy-MM-dd h:mm a' // 2025-01-01 1:00 AM
  | 'yyyy-MM-dd h:mm:ss a' // 2025-01-01 1:00:00 AM
  | 'yyyy-MM-dd' // 2025-01-01
  | 'MM.dd.yyyy' // 01.01.2025
  | 'yyyy'; // Year only
