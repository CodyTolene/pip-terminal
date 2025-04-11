import { clearScreen } from 'src/app/commands/clear-screen.command';
import { dirCreate } from 'src/app/commands/dir-create.command';
import { dirDelete } from 'src/app/commands/dir-delete.command';
import { dirList } from 'src/app/commands/dir-list.command';
import { enterDemoMode } from 'src/app/commands/enter-demo-mode.command';
import { enterFactoryMode } from 'src/app/commands/enter-factory-mode.command';
import { enterSleepMode } from 'src/app/commands/enter-sleep-mode.command';
import { fileDelete } from 'src/app/commands/file-delete.command';
import { fileLoad } from 'src/app/commands/file-load.command';
import { getApps } from 'src/app/commands/get-apps.command';
import { getBatteryLevel } from 'src/app/commands/get-battery-level.command';
import { getFirmwareVersion } from 'src/app/commands/get-firmware-version.command';
import { getId } from 'src/app/commands/get-id.command';
import { getIsSleeping } from 'src/app/commands/get-is-sleeping.command';
import { getJavascriptVersion } from 'src/app/commands/get-javascript-version.command';
import { getOwnerName } from 'src/app/commands/get-owner-name.command';
import { getSDCardStats } from 'src/app/commands/get-sd-card-stats.command';
import { installBootloader } from 'src/app/commands/install-bootloader.command';
import { playRadioFile } from 'src/app/commands/play-radio-file.command';
import { readRawFile } from 'src/app/commands/read-raw-file.command';
import { resetOwnerName } from 'src/app/commands/reset-owner-name.command';
import { restartDevice } from 'src/app/commands/restart-device.command';
import { setDateTime } from 'src/app/commands/set-date-time.command';
import { setOwnerName } from 'src/app/commands/set-owner-name.command';
import { shutdownDevice } from 'src/app/commands/shutdown-device.command';
import { stopAllSounds } from 'src/app/commands/stop-all-sounds.command';
import { wakeDevice } from 'src/app/commands/wake-device.command';

export const Commands = {
  clearScreen,
  dirCreate,
  dirDelete,
  dirList,
  enterDemoMode,
  enterFactoryMode,
  enterSleepMode,
  fileDelete,
  fileLoad,
  getApps,
  getBatteryLevel,
  getFirmwareVersion,
  getId,
  getIsSleeping,
  getJavascriptVersion,
  getOwnerName,
  getSDCardStats,
  installBootloader,
  playRadioFile,
  readRawFile,
  resetOwnerName,
  restartDevice,
  setDateTime,
  setOwnerName,
  shutdownDevice,
  stopAllSounds,
  wakeDevice,
};
