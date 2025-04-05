<div align="center">
  <img align="center" src=".github/images/logo/pip-terminal.png" />
  <h1 align="center">Pip Terminal (<a href="https://www.Pip-Boy.com">Pip-Boy.com</a>)</h1>
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
- [Community](#community)
- [Device](#device)
  - [Connecting Directly](#connecting-directly)
  - [Commands](#commands)
  - [Music](#music)
  - [Videos](#videos)
- [Contribution](#contribution)
  - [Prerequisites](#prerequisites)
  - [Development](#development)
  - [Versioning](#versioning)
  - [Content Guidelines](#content-guidelines)
- [License(s)](#licenses)
- [Terms of Use](#terms)
- [Wrapping Up](#wrapping-up)

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## 🕸️ Web App <a name="web-app"></a>

👉 https://www.Pip-Boy.com

The web app simplifies the process of sending commands to the Pip-Boy 3000 Mk V.
It's built using Angular and hosted on Google Firebase, designed to be
responsive across devices. The app is also a PWA, so you can install it and use
it offline, perfect for adventures away from the Vault.

This is a community-driven project, and your ideas, tools, and experiments are
welcome here. Whether you're crafting new apps, tweaking UI, or just exploring
what's possible with the Pip-Boy, you're part of something bigger, a growing
network of Vault-Tec engineers bringing old tech back to life.

<p align="right">[ <a href="#index">Index</a> ]</p>

## 💬 Community <a name="community"></a>

Join the Community

- 🎮 Contribute to the [Pip Apps & Games repository][link-pip-apps].
- 🖥️ Join the [Pip-Boy.com Discord][link-discord].
- 🤖 Join the [RobCo Industries Discord][link-discord-robco-industries].
- 🕸️ Visit the [RobCo Industries Website][link-robco-industries].
- 🐛 Report issues [here][link-new-issue].
- 💡 Suggest features in [Discussions][link-github-discussions].

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## 🖥️ Device <a name="device"></a>

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

See API file for more information [here](API.md).

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Music <a href="music"></a>

Music must be converted to a specific format before it can be played on the
device. Using the [ffmpeg][link-ffmpeg] command-line tool, you can convert music
to the correct format. The following command will convert an MP3 file to a WAV
file with the correct settings:

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

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Videos <a name="videos"></a>

Videos must be converted to a specific format before they can be played on the
device. Using the [ffmpeg][link-ffmpeg] command-line tool, you can convert
videos to the correct format.

TODO

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## 🛠️ Contribution <a name="contribution"></a>

### Prerequisites <a name="prerequisites"></a>

Node.js: https://nodejs.org/en/download/

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

### Development <a name="development"></a>

To get started with development follow these steps:

1. Fork and clone the repository (`dev` branch).

2. Create a new branch `git checkout -b <your-branch-name>`.

3. Run `npm install` in the root folder to install the project dependencies.

4. Run `npm run start` to start the development app.

5. Open a browser and navigate to `http://localhost:4200`.

6. Make your changes to the code (browser will automatically reload).

7. Push your changes up to GitHub.

8. Open a pull request to the `dev` branch here.

9. Wait for the pull request to be reviewed and merged.

10. Once in the `dev` branch, your code will go out to production in the next
    release.

Thank you for any and all contributions!

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

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

### Content Guidelines <a name="content-guidelines"></a>

When contributing to this project, please ensure that all assets and code are
original, properly licensed, or free to use. We encourage creativity and
experimentation, but ask contributors to respect copyright and legal guidelines.

Avoid including materials that may be subject to copyright or licensing
restrictions, such as:

- Music
- Videos
- Images
- Fonts
- Text
- Source code from other projects

If you're ever unsure whether something is appropriate to include, feel free to
ask in a discussion or open an issue.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## ⚖️ License(s) <a name="licenses"></a>

This project is licensed under the Creative Commons Attribution-NonCommercial
4.0 International License. See the [license][link-license] file for more
information.

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

`SPDX-License-Identifiers: CC-BY-NC-4.0, MPL-2.0, LicenseRef-Typodermic-Free-Desktop, CC0-1.0`

> ![Warn][img-warn] By using this software, you acknowledge and agree to the
> terms of these licenses.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## 📜 Terms of Use <a name="terms"></a>

Bethesda Softworks, LLC. The Wand Company, all trademarks, logos, and brand
names are the property of their respective owners. This project is for personal
use only and is not intended for commercial purposes. Use of any materials is at
your own risk.

For more information, see the full [Terms of Use][link-terms] document.

<p align="right">[ <a href="#index">Index</a> ]</p>

<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->
<!---------------------------------------------------------------------------->

## 🏁 Wrapping Up <a name="wrapping-up"></a>

Thank you to Bethesda & The Wand Company for such a fun device to tinker with!
If you have any questions, please let me know by opening an issue
[here][link-new-issue].

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
[img-warn]: .github/images/ng-icons/warn.svg

<!-- LINK REFERENCES -->

[link-discord-robco-industries]: https://discord.gg/WNEuWsck6n
[link-discord]: https://discord.gg/zQmAkEg8XG
[link-ffmpeg]: https://ffmpeg.org/
[link-font-monofonto]: https://typodermicfonts.com/monofonto/
[link-github-discussions]:
  https://github.com/CodyTolene/pip-terminal/discussions
[link-license-mit]: /LICENSE_MIT.md
[link-license-mpl]: /LICENSE_MPL.md
[link-license]: /LICENSE.md
[link-new-issue]: https://github.com/CodyTolene/pip-terminal/issues
[link-pip-apps]: https://github.com/CodyTolene/pip-apps
[link-robco-industries]: https://log.robco-industries.org/
[link-terms]: /TERMS.md
