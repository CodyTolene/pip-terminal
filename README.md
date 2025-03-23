<div align="center">
  <img align="center" src=".github/images/logo/pip-terminal.png" />
  <h1 align="center">Pip Terminal</h1>
  <p align="center">
    A special terminal for giving you a bit more control over your Pip-Boy 3000 Mk V!
  </p>
  <p align="center">
    Purchase the device from the Bethesda store 
    <a href="https://gear.bethesda.net/products/fallout-series-pip-boy-die-cast-replica">
      here</a>. View the official upgrade site 
    <a href="https://www.thewandcompany.com/pip-boy/upgrade/">
      here</a>.
  </p>
</div>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Index <a name="index"></a>

- [Web App](#web-app)
- [Device](#device)
  - [Connecting Directly](#connecting-directly)
  - [Commands](#commands)
  - [Music](#music)
  - [Videos](#videos)
- [Contribution](#contribution)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
  - [Versioning](#versioning)
- [License(s)](#licenses)
- [Terms of Use](#terms)
- [Wrapping Up](#wrapping-up)

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Web App <a name="web-app"></a>

https://www.pip-boy.com

The web app simplifies the process of sending commands to the Pip-Boy 3000 Mk V.
The app is built using Angular and is hosted on Google Firebase. The app is
designed to be responsive and work on all devices. The app is also a PWA, so you
can install it on your device and use it offline.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Device <a name="device"></a>

### Connecting Directly <a name="connecting-directly"></a>

Connecting directly to the Pip-Boy 3000 Mk V is possible using the Espruino CLI
and a USB cable. The following steps will guide you through the process:

```bash
# Install the Espruino CLI
npm install -g espruino
# List out all possible serial ports
espruino --list
# Connect to the serial port (update the COM port)
espruino -p COM12
```

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Commands <a name="commands"></a>

See API file for more information [here][API.md].

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Music <a href="music"></a>

Music must be converted to a specific format before it can be played on the
device. Using the `ffmpeg` command-line tool, you can convert music to the
correct format. The following command will convert an MP3 file to a WAV file
with the correct settings:

```bash
`ffmpeg -i "input.mp3" -ac 1 -ar 16000 -sample_fmt s16 -c:a pcm_s16le -f wav output.wav`
```

If you would like to shorten it to X seconds only you can add the `-t 10` (10
seconds example):

```bash
`ffmpeg -i "input.mp3" -t 10 -ac 1 -ar 16000 -sample_fmt s16 -c:a pcm_s16le -f wav output.wav`
```

Convert a whole folder of music (ie `/music`) to an output folder
(`/music/output`), you can use the following command:

```bash
mkdir output && for %F in (*.mp3) do ffmpeg -i "%F" -ac 1 -ar 16000 -sample_fmt s16 -c:a pcm_s16le -f wav "output\%~nF.wav"
```

Increase volume with `volume=`:

```bash
mkdir output && for %F in (*.mp3) do ffmpeg -i "%F" -af "volume=10dB" -ac 1 -ar 16000 -sample_fmt s16 -c:a pcm_s16le -f wav "output\%~nF.wav"
```

Usefule links:

Fallout New Vegas

- https://archive.org/details/johann-sebastian-bach-concerto-for-2-violins-in-d-minor-allegro-ma-non-troppo

Fallout 3

- https://archive.org/details/Fallout_3_galaxy_news_radio-2008

Fallout 4

- https://archive.org/details/rebuild-renew

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Videos <a name="videos"></a>

Videos must be converted to a specific format before they can be played on the
device. Using the `ffmpeg` command-line tool, you can convert videos to the
correct format.

TODO

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Contribution <a name="contribution"></a>

### Prerequisites <a name="prerequisites"></a>

Node.js: https://nodejs.org/en/download/

### Development <a name="development"></a>

To get started with development follow these steps:

1. Clone the repository.

2. Run `npm install` to install the project dependencies.

3. Run `npm run start` to start the development app.

4. Open a browser and navigate to `http://localhost:4200`.

5. Make changes to the code and the browser will automatically reload.

6. Update the version by following the steps here in [Versioning](#versioning).

7. Add your changes and push to a new branch.

8. Open a pull request to the `main` branch.

9. Wait for the pull request to be reviewed and merged.

Thank you for any and all contributions!

### Versioning <a name="versioning"></a>

There is one single source of truth for the project version. This is the
`package.json` file. Steps to update version:

1. Update the "version" property in the `package.json` file.

2. Run `npm run update:version` to manually update the version across the
   project.

> ![Info][img-info] Running `npm run start` or `npm run build` will also update
> the version automatically, and globally from the current `package.json` file.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## License(s) <a name="licenses"></a>

This project is licensed under the MIT License. See the [MIT
License][link-license-mit] file for more information.

This project uses the following third party libraries:

- jszip: A library for creating, reading, and editing .zip files. Licensed under
  the [MIT License][link-license-mit].
- jquery: A fast, small, and feature-rich JavaScript library. Licensed under the
  [MIT License][link-license-mit].
- espruino uart.js: A library for interfacing with the Espruino UART. Licensed
  under the [Mozilla Public License 2.0][link-license-mpl].

This project uses the **Monofonto** font by Typodermic Fonts Inc. for the
project PNG logo.

- Free for desktop and image/logo use (commercial & non-commercial).
- Download from: [Typodermic Fonts][link-font-monofonto]

This project uses sounds found on FreeSound.org. The sounds are licensed under
the Creative Commons 0 License. The list of sounds can be found below:

- [`tick.wav`](https://freesound.org/people/Joao_Janz/sounds/477704/) by
  Joao_Janz

- [`tick-2.wav`](https://freesound.org/people/joedeshon/sounds/119415/) by
  joedeshon

`SPDX-License-Identifiers: MIT, MPL-2.0, LicenseRef-Typodermic-Free-Desktop, CC0-1.0`

By using this software, you acknowledge and agree to the terms of these
licenses.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Terms of Use <a name="terms"></a>

Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, and brand
names are the property of their respective owners. This project is for personal
use only and is not intended for commercial purposes. Use of any materials is at
your own risk.

For more information, see the full [Terms of Use][link-terms] document.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## Wrapping Up <a name="wrapping-up"></a>

Thank you to Bethesda & The Wand Company for such a fun device to tinker with!
If you have any questions, please let me know by opening an issue
[here][url-new-issue].

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
[link-terms]: /TERMS.md
[url-new-issue]: https://github.com/CodyTolene/pip-boy-mod-terminal/issues
