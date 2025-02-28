let _connection = null;
let _firmwareVersion = "";
let _id = "";
let _javascriptVersion = "";
let writer;

const EVAL_TIMEOUT = 2000;
const MAX_RETRIES = 3;

// Connect
async function connect(retryCount = 0) {
  try {
    _connection = await UART.connectAsync();

    if (!_connection || !_connection.isOpen) {
      logMessage("❌ Connection failed.");
      if (retryCount < MAX_RETRIES) {
        logMessage(
          `🔄 Retrying connection... (${retryCount + 1}/${MAX_RETRIES})`
        );
        return connect(retryCount + 1);
      }
      return;
    }

    logMessage("✅ Connected!");

    await initialize();
  } catch (error) {
    logMessage("❌ Connection failed:", error.message);
    if (retryCount < MAX_RETRIES) {
      logMessage(
        `🔄 Retrying connection... (${retryCount + 1}/${MAX_RETRIES})`
      );
      return connect(retryCount + 1);
    }
  }
}

// Initialize
async function initialize() {
  _connection.on("close", (msg) => {
    logMessage("✅ Disconnected!", msg);
    disableAllControlsExceptConnect();
    setOwnerInputValue("<NONE>");
    $("#fileInput").val("");
    _connection = null;
  });

  _connection.on("error", (err) => logMessage("❌ Connection error:", err));

  try {
    logMessage("🔍 Fetching device information...");

    const ownerName = await getOwnerName();
    logMessage("🏷️ Owner:", ownerName);

    _firmwareVersion = await getFirmwareVersion();
    logMessage("🔧 Firmware version:", _firmwareVersion);

    _javascriptVersion = await getJavascriptVersion();
    logMessage("📦 JS version:", _javascriptVersion);

    _id = await getId();
    logMessage("🆔 Device ID:", _id);

    enableAllControlsExceptConnect();
    disableSleepAwakeControls();

    // Check if pip is sleeping
    const isAsleep = await isSleeping();
    logMessage("🛌 Sleeping:", isAsleep);

    if (isAsleep === true) {
      setIsAsleepControls();
    } else if (isAsleep === false) {
      setIsAwakeControls();
    } else if (isAsleep === "BUSY") {
      logMessage("⚠️ Pip is busy. Retrying...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await initialize();
    }

    setOwnerInputValue(ownerName);
  } catch (error) {
    logMessage("❌ Error initializing:", error.message);
  }
}

// Disconnect
async function disconnect() {
  if (!_connection) {
    logMessage("⚠️ No active connection to disconnect.");
    return;
  }

  try {
    logMessage("🔌 Disconnecting...");
    await _connection.close();
  } catch (error) {
    logMessage("❌ Error disconnecting:", error.message);
    return;
  }
}

// Restart the device
async function restart() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  try {
    logMessage("♻️ Rebooting now...");
    await cmd("setTimeout(() => { E.reboot(); }, 100);");
  } catch (error) {
    logMessage("❌ Error: ", error);
    return;
  }
}

// Sleep the device
async function sleep() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  let isAsleep = await isSleeping();
  if (isAsleep === true) {
    logMessage("⚠️ Already sleeping.");
    setIsAsleepControls();
    return;
  } else if (isAsleep === "BUSY") {
    logMessage("⚠️ Pip is busy. Retrying...");
    await waitFor(1000);
    return await sleep();
  }

  logMessage("💤 Sleeping now...");
  disableAllControls();

  try {
    await cmd(`
      (() => { 
        Pip.sleeping = true; 
        Pip.offOrSleep({ immediate:false, forceOff:false, playSound:true }); 
      })()
    `);

    const maxRetries = 10;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await waitFor(1500);

      isAsleep = await isSleeping();
      logMessage(
        `💤 Sleep check [Attempt ${attempt + 1}/${maxRetries}]:`,
        isAsleep
      );

      if (isAsleep === true) {
        logMessage("✅ Successfully set to sleep.");
        enableAllControlsExceptConnect();
        setIsAsleepControls();
        return;
      } else if (isAsleep === "false") {
        logMessage("❌ Unexpected response, retrying...");
      }
    }

    logMessage("❌ Failed to confirm sleep after multiple attempts.");
  } catch (error) {
    logMessage("❌ Error: ", error);
  }

  enableAllControlsExceptConnect();
  setIsAwakeControls();
}

// Wake the device
async function wake() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  let isAsleep = await isSleeping();
  if (isAsleep === false) {
    logMessage("⚠️ Already awake.");
    setIsAwakeControls();
    return;
  } else if (isAsleep === "BUSY") {
    logMessage("⚠️ Pip is busy. Retrying...");
    await waitFor(1000);
    return await wake();
  }

  logMessage("🚨 Waking up now...");
  disableAllControls();

  try {
    isAsleep = await cmd(`
      (() => {
        if (Pip.sleeping) {
          Pip.sleeping = false;
          Pip.wake();
          Pip.brightness = 20;
          Pip.addWatches();
          setTimeout(() => { Pip.fadeOn([LCD_BL, LED_RED, LED_GREEN]); }, 100);
          showMainMenu();
        }
        return Pip.sleeping;
      })()
    `);
    await waitFor(1000);
    if (isAsleep === false) {
      logMessage("🌞 Successfully woke up.");
      enableAllControlsExceptConnect();
      setIsAwakeControls();
      return;
    } else {
      logMessage("❌ Failed to wake up, please try again.");
    }
  } catch (error) {
    logMessage("❌ Error: ", error);
  }

  enableAllControlsExceptConnect();
  setIsAsleepControls();
}

// Shutdown the device
async function shutdown() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  disableAllControls();
  logMessage("🛑 Shutting down...");

  try {
    await cmd(
      "Pip.offOrSleep({ immediate:false, forceOff:true, playSound:true })"
    );

    const maxRetries = 10;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      await waitFor(1500);

      if (!_connection || !_connection.isOpen) {
        logMessage("✅ Shutdown complete.");
        break;
      }

      let isBusy = (await isSleeping()) === "BUSY";
      logMessage(
        `🛑 Shutdown check [Attempt ${attempt + 1}/${maxRetries}]:`,
        isBusy ? "BUSY" : "OK"
      );

      if (!isBusy || !_connection || !_connection.isOpen) {
        logMessage("✅ Shutdown complete.");
        break;
      }
    }
  } catch (error) {
    logMessage("❌ Error: ", error);
    return;
  }

  disableAllControlsExceptConnect();
}

// Upgrade firmware - fixed version using espruinoSendFile
async function startUpgrade() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  const fileInput = document.getElementById("fileInput");
  if (!fileInput.files.length) {
    alert("❌ Please select a ZIP file.");
    return;
  }

  const zipFile = fileInput.files[0];
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const progressContainer = document.getElementById("progressContainer");

  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressText.innerText = "0%";

  logMessage(`📂 Selected file: ${zipFile.name}`);
  logMessage("🚀 Starting upload...");

  const zipData = await readZipFile(zipFile);
  const zip = await JSZip.loadAsync(zipData);

  const files = Object.entries(zip.files).filter(([_, file]) => !file.dir);
  const totalSize = files.reduce(
    (acc, [_, file]) => acc + file._data.uncompressedSize,
    0
  );

  let uploaded = 0;

  for (const [path, file] of files) {
    logMessage(`📄 Uploading: ${path}`);

    const fileData = await file.async("uint8array");

    const uploadedSize = await uploadFileToPip(path, fileData);

    if (uploadedSize === 0) {
      logMessage(`❌ Failed to upload ${path}. Aborting.`);
      progressContainer.style.display = "none"; // Hide after failure
      return;
    }

    uploaded += uploadedSize;

    const percent = Math.round((uploaded / totalSize) * 100);
    progressBar.style.width = percent + "%";
    progressText.innerText = percent + "%";
  }

  logMessage("✅ Firmware upgrade complete! Rebooting Pip-Boy...");

  progressContainer.style.display = "none"; // Hide after success
  await restart();
}

async function uploadFileToPip(path, fileData, retries = 3) {
  const fileString = new TextDecoder("latin1").decode(fileData);

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      await _connection.espruinoSendFile(path, fileString, {
        fs: true,
        chunkSize: 1024,
        noACK: true,
      });
      return fileData.length; // success, return file size
    } catch (error) {
      logMessage(
        `⚠️ Upload failed for ${path}: ${error.message}. Retrying (${
          attempt + 1
        }/${retries})...`
      );
      await waitFor(500);
    }
  }
  return 0; // failed
}

// Helper to read ZIP as ArrayBuffer
function readZipFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Set owner name
async function setOwnerName() {
  if (!_connection) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  disableAllControls();

  let ownerName = document.getElementById("ownerName").value.trim();

  if (!ownerName) {
    logMessage("❌ Enter a valid name!");
    enableAllControlsExceptConnect();
    return;
  }

  ownerName = ownerName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "");

  try {
    const success = await cmd(`
      (() => {
        try {
          settings.userName = ''; 
          saveSettings(); 
          settings.userName = '${ownerName}';
          saveSettings();
          return true;
        } catch (e) {
          return false;
        }
      })()
    `);

    if (success) {
      logMessage("✅ Owner set to:", ownerName);
      logMessage("⚠️ Restart the device to apply changes.");
      setOwnerInputValue(ownerName);
    } else {
      logMessage("❌ Failed to set owner name.");
    }
  } catch (error) {
    logMessage("❌ Error: ", error);
  } finally {
    enableAllControlsExceptConnect();
  }
}

/**
 * Reset owner name to empty.
 *
 * @returns {Promise<void>}
 */
async function resetOwnerName() {
  if (!_connection) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  disableAllControls();

  try {
    const success = await cmd(`
      (() => {
        try {
          settings.userName = '';
          saveSettings();
          delete settings.userName;
          saveSettings();
          return true;
        } catch (e) {
          return false;
        }
      })()
    `);

    if (success) {
      logMessage("✅ Owner name reset!");
      logMessage("⚠️ Restart the device to apply changes.");
      setOwnerInputValue("<NONE>");
    } else {
      logMessage("❌ Failed to reset owner name.");
    }
  } catch (error) {
    logMessage("❌ Error: ", error);
  } finally {
    enableAllControlsExceptConnect();
  }
}

/**
 * Execute a command on the device.
 *
 * @param {string} command
 * @param {object} options
 * @param {number} retries
 * @returns
 */
async function cmd(command, options = {}, retries = 0) {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Connection is closed, cannot execute command:", command);
    return null;
  }

  try {
    return await _connection.espruinoEval(command, {
      ...options,
      timeout: EVAL_TIMEOUT,
    });
  } catch (error) {
    if (retries < MAX_RETRIES) {
      if (retries > 0) {
        logMessage(`⚠️ Eval timeout. Retrying...`);
      }
      return cmd(command, options, retries + 1);
    }
    logMessage(
      "❌ Eval failed:",
      error?.toString() || error?.message || "Undefined"
    );
    return null;
  }
}

/**
 * Fetch firmware version.
 *
 * @returns {Promise<string>}
 */
async function getFirmwareVersion() {
  return cmd("process.env.VERSION", { flushReceived: true });
}

/**
 * Fetch JavaScript version.
 *
 * @returns {Promise<string>}
 */
async function getJavascriptVersion() {
  return cmd(
    "(()=>{" +
      "let s=require('Storage');" +
      "let l=s.list();" +
      "if(l.includes('VERSION')&&l.includes('.bootcde')) return s.read('VERSION');" +
      "else return 'unknown'" +
      "})()"
  );
}

/**
 * Fetch owner name.
 *
 * @returns {Promise<string>}
 */
async function getOwnerName() {
  return cmd("typeof(settings)=='object'?settings.userName||'<NONE>':'<NONE>'");
}

/**
 * Fetch device ID.
 *
 * @returns {Promise<string>}
 */
async function getId() {
  return cmd("(typeof(Pip)=='function'&&Pip.getID) ? Pip.getID() : 'Unknown'");
}

/**
 * Check if Pip is sleeping.
 *
 * @returns {Promise<boolean | "BUSY">}
 */
async function isSleeping() {
  return cmd("Pip.sleeping");
}

/**
 * Wait async for a specified time.
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
async function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
