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

## Button API

```js
BTN_PLAY.read()       // Read play button state
BTN_TUNEUP.read()     // Read tune-up button state (Clockwise)
BTN_TUNEDOWN.read()   // Read tune-down button state (Counter-clockwise)
BTN_POWER.read()      // Read power button state
BTN_TORCH.read()      // Read torch button state
KNOB1_A.read()        // Read knob1 rotation A (Clockwise)
KNOB1_B.read()        // Read knob1 rotation B (Counter-clockwise)
KNOB1_BTN.read()      // Read knob1 button press
KNOB2_A.read()        // Read knob2 rotation A (Counter-clockwise)
KNOB2_B.read()        // Read knob2 rotation B (Clockwise)
```

## Current API

```js
Array(x)
B15.set()                                 // Set pin B15 high
B6.write(0)                               // Set pin B6 low
B6.write(1)                               // Set pin B6 high
B7.read()                                 // Read the state of pin B7
CHARGE_STAT.read()                        // Read charging status
Date()                                    // Get current date and time
Date(settings.alarm.time)                 // Create a Date object from alarm time
E.clip(value, min, max)                   // Clamp value between min and max
E.defrag()                                // Defragment Espruino memory
E.getAddressOf(variable, index)           // Get memory address of variable at index
E.getAnalogVRef()                         // Get reference voltage for analog readings
E.getConsole()                            // Get the active console output
E.getTemperature()                        // Get internal temperature sensor value
E.nativeCall(address, signature)          // Call native function
E.openFile("MAP/MAP.img", "r")            // Open map image file
E.openFile("test", "r")                   // Open file "test" for reading
E.openFile("test", "w")                   // Open file "test" for writing
E.reboot()                                // Reboot the device
E.sendUSBHID([0,0,0,0,0,0,0,0])           // Send empty HID report
E.sendUSBHID([j,0,0,0,0,0,0,0])           // Send keypress `j`
E.setTimeZone(settings.timezone)          // Set time zone from settings
E.showMenu(menu)                          // Display a menu
E.showMessage("Rebooting...")             // Display rebooting message
E.showMessage("Pip-Boy powering off")     // Display power-off message
E.showPrompt("Sound heard OK?")           // Prompt user
E.showPrompt("No SD card inserted!", { buttons: { OK: !0 } })  // Alert user
Error("Can't save settings - no SD card") // Error handling
LCD_BL.set()
LCD_BL.write(0)                           // Turn LCD backlight off
LCD_BL.write(1)                           // Turn LCD backlight on
MEAS_ENB.write(0)                         // Disable measurement
MEAS_ENB.write(1)                         // Enable measurement
Pip.addWatches()
Pip.audioBuiltin("CLICK")                 // Play built-in click sound
Pip.audioGetFree()                        // Get available audio buffer
Pip.audioIsPlaying()                      // Check if audio is playing
Pip.audioStart("UI/ALERT.wav")            // Play sound file
Pip.audioStop()                           // Stop audio
Pip.fadeOff()
Pip.fadeOn()
Pip.getDateAndTime()                      // Get date and time
Pip.getID()                               // Get device ID
Pip.isSDCardInserted()                    // Check SD card presence
Pip.kickIdleTimer()
Pip.knob1Click(a)
Pip.knob2Click(b)
Pip.measurePin(VBAT_MEAS)
Pip.measurePin(VUSB_MEAS)
Pip.off()
Pip.offAnimation()
Pip.offOrSleep({ immediate: !0 })
Pip.remove()
Pip.removeAllListeners("knob1")
Pip.removeAllListeners("knob2")
Pip.removeAllListeners("torch")
Pip.removeSubmenu()
Pip.setDateAndTime(a)
Pip.setPalette(settings.palette.split(","))
Pip.typeText("Hello")                     // Type text
Pip.updateBrightness()
Pip.videoStart(`MAP/${b[c]}`, e)
Pip.videoStart(`STAT/${a[Pip.statIndex]}`, c)
Pip.videoStop()
Pip.wake()
RADIO_AUDIO.mode("analog")
SDCARD_DETECT.read()
String.fromCharCode(d)
Uint16Array(60)
Uint8Array(4096)
Uint8Array(d.length)
VUSB_PRESENT.read()
clearInterval(interval)                   // Clear interval
clearTimeout(timeout)                     // Clear timeout
console.error("Error")                    // Print error message
console.log("Message")                    // Print message to console
createArrayBuffer(100, 25, 2, { msb: !0 })
createArrayBuffer(120, 120, 2, { msb: !0 })
g.clear()                                 // Clear screen
g.clearRect(x1, y1, x2, y2)               // Clear rectangle
g.drawLine(x1, y1, x2, y2)                // Draw line
g.drawPoly([...points])                   // Draw polygon
g.drawRect(x1, y1, x2, y2)                // Draw rectangle
g.drawString(text, x, y)                  // Draw string at (x, y)
g.fillRect(x1, y1, x2, y2)                // Fill rectangle
g.getWidth()                              // Get screen width
g.getHeight()                             // Get screen height
process.memory()                          // Get memory usage
require("Storage").read("BOOT/BOOT.avi")  // Read boot animation file
require("fs").readFile("settings.json")   // Read settings file
require("fs").writeFile("settings.json", JSON.stringify(settings))  // Write settings file
setInterval(callback, ms)                 // Set interval
setTimeout(callback, ms)                   // Set timeout
```
