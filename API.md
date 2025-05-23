# Pip-Boy Espruino API Reference

Technical references for the Espruino-based Pip-Boy device.

This device has:

- A horizontal landscape three-and-a-half inch, 320 x 480 TFT LCD display
- On the left of the device, a rotating knob for scrolling up (`KNOB1_A`) and down (`KNOB1_B`) on menus, with a button press (`KNOB1_BTN`).
- On the top-right of the device, a rotating knob for scrolling left (`KNOB2_A`) and right (`KNOB2_B`) on sub-menus.
- On the right of the device, a limited rotating knob for changing the main tab menu item.
- On the top of the device, a button for activating the torch (`BTN_TORCH`).
- On the bottom of the device, a button for turning the device on and off, or sleeping (`BTN_POWER`).
- On the front-right of the device, a limited rotating knob for tuning up (`BTN_TUNEUP`) and down (`BTN_TUNEDOWN`) for the radio, with a button press (`BTN_PLAY`).
- On the bottom-right of the device, a limited rotating knob for volume up and down.
- On the front-right of the device, a LED indicator for charging status (and radiation level).

## Buttons & Knobs

```js
BTN_PLAY
BTN_TUNEUP
BTN_TUNEDOWN
BTN_POWER
BTN_TORCH
KNOB1_A
KNOB1_B
KNOB1_BTN
KNOB2_A
KNOB2_B
```

## Pip-Boy API

Global Functions

```
print(Object.keys(global).filter(k => typeof global[k] === 'function'));
```

```
[
  "Graphics",
  "Function",
  "Object",
  "Pin",
  "log",
  "saveSettings",
  "configureAlarm",
  "wakeOnLongPress",
  "playBootAnimation",
  "checkBatteryAndSleep",
  "wakeFromSleep",
  "submenuBlank",
  "showMainMenu",
  "enterDemoMode",
  "leaveDemoMode",
  "factoryTestMode",
  "fs",
  "process",
  "Date",
  "console",
  "File",
  "Number",
  "String",
  "Pip",
  "JSON",
  "E",
  "Array",
  "dc",
  "showTorch",
  "torchButtonHandler",
  "drawVaultTecLogo",
  "drawVaultNumLogo",
  "drawText",
  "showVaultAssignment",
  "submenuClock",
  "getRandomExcluding",
  "I2C",
  "readRDSData",
  "radioPlayClip",
  "submenuRadio",
  "submenuStatus",
  "submenuConnect",
  "submenuDiagnostics",
  "submenuRad",
  "submenuMap",
  "showAlarm",
  "submenuInvAttach",
  "submenuExtTerminal",
  "submenuApparel",
  "submenuStats",
  "submenuAbout",
  "getUserVideos",
  "submenuVideos",
  "getUserAudio",
  "submenuAudio",
  "getUserApps",
  "submenuApps",
  "submenuSetAlarm",
  "submenuMaintenance",
  "drawHeader",
  "drawFooter",
  "checkMode",
  "createDateTimeSubmenu",
  "submenuSetDateTime",
  "submenuSetAlarmTime",
  "submenuPalette",
  "Math",
  "Promise",
  "RegExp"
 ]
```

Pip Functions

```
for (let k in Pip) { if (typeof Pip[k] === 'function') print('Pip.' + k); }
```

```
Pip.isSDCardInserted
Pip.setDateAndTime
Pip.getDateAndTime
Pip.measurePin
Pip.getID
Pip.knob1Click
Pip.knob2Click
Pip.typeText
Pip.offAnimation
Pip.offOrSleep
Pip.offButtonHandler
Pip.kickIdleTimer
Pip.fadeOff
Pip.fadeOn
Pip.updateBrightness
Pip.powerButtonHandler
Pip.usbConnectHandler
Pip.addWatches
Pip.remove
Pip.removeSubmenu
```
