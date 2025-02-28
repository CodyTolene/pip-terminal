<div align="center">
  <img align="center" src=".github/images/logo/logo.png" />
  <h1 align="center">Pip-Boy Mod Terminal</h1>
  <p align="center">
    A special terminal for giving you a bit more control over your Pip-Boy 3000 Mk V!
  </p>
  <p align="center">
    Purchase the device from the Bethesda store [here][link-pip-boy]. View the official upgrade site [here][link-upgrade].
  </p>
</div>

## Index <a name="index"></a>

- [Web App](#web-app)
  - [Connecting](#connecting)
  - [Personalizing](#personalizing)
  - [Firmware Upgrade](#firmware-upgrade)
  - [Videos](#videos)
  - [Music](#music)
- [Known UART Commands](#uart)
  - [Core System Commands](#core)
  - [System Info & Settings](#system-info-settings)
  - [Display & UI](#display-ui)
  - [Alarm & Time-Based Functions](#alarm-time)
  - [Input & Button Handling](#input-and-buttons)
  - [Power Management & Battery](#power-management)
  - [SD Card & File Management](#sd-card)
  - [Debugging & Logging](#debugging)
  - [Miscellaneous](#miscellaneous)
- [License(s)](#licenses)
- [Terms of Use](#terms)
- [Wrapping Up](#wrapping-up)

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Web App <a name="web-app"></a>

https://raw.githack.com/CodyTolene/pip-boy-mod-terminal/main/index.html

### Connecting <a name="connecting"></a>

...

### Personalizing <a name="personalizing"></a>

...

### Firmware Upgrade <a name="firmware-upgrade"></a>

...

### Videos <a name="videos"></a>

...

### Music <a name="music"></a>

...

## Known UART Commands <a name="uart"></a>

### Core System Commands <a name="core"></a>

Some are untested and may not work as expected depending on the firmware version you have. Use at your own risk.

| Command                             | Description                                                        |
| :---------------------------------- | :----------------------------------------------------------------- |
| `Pip.wake();`                       | Wake up the device from sleep mode.                                |
| `Pip.offOrSleep({playSound:true});` | Turn off the device or put it into sleep mode with a sound effect. |
| `Pip.off({playSound:true});`        | Force shutdown with a sound effect.                                |
| `E.restart();`                      | Restart the device.                                                |
| `E.reboot();`                       | Perform a full reboot.                                             |
| `Pip.isSDCardInserted();`           | Check if an SD card is inserted.                                   |
| `Pip.getID();`                      | Retrieve the device’s unique ID.                                   |

### System Info & Settings <a name="system-info-settings"></a>

| Command                    | Description                                                 |
| :------------------------- | :---------------------------------------------------------- |
| `process.env.VERSION`      | Get the Espruino firmware version.                          |
| `settings.userName`        | Retrieve the current user's name.                           |
| `E.getAnalogVRef();`       | Get the analog reference voltage.                           |
| `E.getTemperature();`      | Retrieve the current temperature from the system.           |
| `E.getConsole();`          | Get the current active console mode (USB, Bluetooth, etc.). |
| `settings.alarm.enabled`   | Check if the alarm is enabled.                              |
| `settings.alarm.time`      | Get the alarm time.                                         |
| `settings.timezone`        | Retrieve the device's configured timezone.                  |
| `JSON.stringify(settings)` | Get the full settings object as a JSON string.              |
| `saveSettings();`          | Save the current settings to storage.                       |

### Display & UI <a name="display-ui"></a>

| Command                                    | Description                                     |
| :----------------------------------------- | :---------------------------------------------- |
| `Pip.showMainMenu();`                      | Display the main menu on the screen.            |
| `Pip.remove();`                            | Clear the screen and remove active UI elements. |
| `Pip.removeSubmenu();`                     | Remove the active submenu.                      |
| `Pip.fadeOn();`                            | Turn on the screen gradually.                   |
| `Pip.fadeOff();`                           | Turn off the screen gradually.                  |
| `Pip.brightness = X;`                      | Set the screen brightness (X = 0-100).          |
| `Pip.videoStart('BOOT/BOOT.avi', {x:40});` | Start playing a video file.                     |
| `Pip.audioStart('BOOT/BOOT_DONE.wav');`    | Play an audio file.                             |
| `Pip.setFontMonofonto18();`                | Set the font to Monofonto 18px.                 |
| `Pip.setFontAlign(0,-1);`                  | Align text to the center.                       |
| `g.clear();`                               | Clear the screen.                               |
| `g.drawString('Hello World', 240, 250);`   | Draw text at a specific location on the screen. |

### Alarm & Time-Based Functions <a name="alarm-time"></a>

| Command                                                            | Description                            |
| :----------------------------------------------------------------- | :------------------------------------- |
| `Pip.getDateAndTime();`                                            | Get the current date and time.         |
| `Pip.setDateAndTime(new Date());`                                  | Set the system date and time.          |
| `configureAlarm();`                                                | Configure the alarm based on settings. |
| `alarmTimeout=setTimeout(() => { console.log('ALARM!'); }, time);` | Set an alarm event after a delay.      |

### Input & Button Handling <a name="input-and-buttons"></a>

| Command                                                     | Description                                  |
| :---------------------------------------------------------- | :------------------------------------------- |
| `setWatch(callback, BTN_POWER, {edge:'falling'});`          | Set a button press event for power button.   |
| `Pip.on('knob1', function(value) { console.log(value); });` | Attach an event listener to the first knob.  |
| `Pip.on('knob2', function(value) { console.log(value); });` | Attach an event listener to the second knob. |
| `Pip.emit('knob1', 20);`                                    | Simulate turning the first knob.             |
| `Pip.emit('knob2', 1);`                                     | Simulate turning the second knob.            |
| `Pip.kickIdleTimer();`                                      | Prevent the device from going idle.          |

### Power Management & Battery <a name="power-management"></a>

| Command                      | Description                    |
| :--------------------------- | :----------------------------- |
| `Pip.measurePin(VBAT_MEAS);` | Measure the battery voltage.   |
| `VUSB_PRESENT.read();`       | Check if the USB is connected. |
| `Pip.sleeping = true;`       | Mark the device as sleeping.   |
| `Pip.off();`                 | Turn off the device.           |

### SD Card & File Management <a name="sd-card"></a>

| Command                                                               | Description                            |
| :-------------------------------------------------------------------- | :------------------------------------- |
| `require('Storage').list();`                                          | List files stored in internal storage. |
| `require('Storage').read('VERSION');`                                 | Read the contents of the VERSION file. |
| `require('fs').writeFile('settings.json', JSON.stringify(settings));` | Save settings to an SD card.           |
| `require('fs').readdirSync('/LOGS');`                                 | List files in the logs folder.         |
| `require('fs').statSync('LOGS');`                                     | Get information about the logs folder. |

### Debugging & Logging <a name="debugging"></a>

| Command                   | Description                                     |
| :------------------------ | :---------------------------------------------- |
| `console.log('Message');` | Print a message to the console.                 |
| `log('Message');`         | Log a message (likely custom logging function). |
| `E.getAnalogVRef();`      | Debug voltage reference readings.               |
| `process.memory().usage;` | Get the memory usage.                           |
| `typeof(Pip);`            | Check if Pip functions exist.                   |

### Miscellaneous <a name="miscellaneous"></a>

| Command                     | Description              |
| :-------------------------- | :----------------------- |
| `Pip.demoMode = MODE.STAT;` | Enter demo mode.         |
| `Pip.enterDemoMode();`      | Start demo mode.         |
| `Pip.leaveDemoMode();`      | Exit demo mode.          |
| `Pip.setDACMode('out');`    | Set DAC output mode.     |
| `Pip.factoryTestMode();`    | Enter factory test mode. |

## License(s) <a name="licenses"></a>

This project is licensed under the MIT License. See the [MIT License][link-license-mit] file for more information.

This project uses the following third party libraries:

- jszip: A library for creating, reading, and editing .zip files. Licensed under the [MIT License][link-license-mit].
- jquery: A fast, small, and feature-rich JavaScript library. Licensed under the [MIT License][link-license-mit].
- espruino uart.js: A library for interfacing with the Espruino UART. Licensed under the [Mozilla Public License 2.0][link-license-mpl].

This project uses the **Monofonto** font by Typodermic Fonts Inc. for the project PNG logo.

- Free for desktop and image/logo use (commercial & non-commercial).
- Download from: [Typodermic Fonts][link-font-monofonto]

`SPDX-License-Identifier: MIT, MPL-2.0, LicenseRef-Typodermic-Free-Desktop`

By using this software, you acknowledge and agree to the terms of these licenses.

## Terms of Use <a name="terms"></a>

Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, and brand names are the property of their respective owners. This project is for personal use only and is not intended for commercial purposes. Use of any materials is at your own risk.

For more information, see the full [Terms of Use][link-terms] document.

## Wrapping Up <a name="wrapping-up"></a>

Thank you to Bethesda & The Wand Company for such a fun device to tinker with, I'm having a lot of fun with this project as embedded systems are a passion of mine. If you have any questions, please let me know by opening an issue [here][url-new-issue].

| Type                                                                      | Info                                                           |
| :------------------------------------------------------------------------ | :------------------------------------------------------------- |
| <img width="48" src=".github/images/ng-icons/email.svg" />                | webmaster@codytolene.com                                       |
| <img width="48" src=".github/images/simple-icons/github.svg" />           | https://github.com/sponsors/CodyTolene                         |
| <img width="48" src=".github/images/simple-icons/buymeacoffee.svg" />     | https://www.buymeacoffee.com/codytolene                        |
| <img width="48" src=".github/images/simple-icons/bitcoin-btc-logo.svg" /> | bc1qfx3lvspkj0q077u3gnrnxqkqwyvcku2nml86wmudy7yf2u8edmqq0a5vnt |

Fin. Happy programming friend!

Cody Tolene

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

<!-- IMAGE REFERENCES -->

[img-info]: .github/images/ng-icons/info.svg
[img-warning]: .github/images/ng-icons/warn.svg

<!-- LINK REFERENCES -->

[link-font-monofonto]: https://typodermicfonts.com/monofonto/
[link-license-mit]: /LICENSE_MIT.md
[link-license-mpl]: /LICENSE_MPL.md
[link-pip-boy]: https://gear.bethesda.net/products/fallout-series-pip-boy-die-cast-replica
[link-terms]: /TERMS.md
[link-upgrade]: https://www.thewandcompany.com/pip-boy/upgrade/
[url-new-issue]: https://github.com/CodyTolene/pip-boy-mod-terminal/issues
