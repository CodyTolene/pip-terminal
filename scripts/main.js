let _connection = null;
let _firmwareVersion = "";
let _javascriptVersion = "";
let _id = "";
let _ownerName = "<NONE>";

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
    enableAllControlsExceptConnect();

    _connection.on("close", (msg) => {
      logMessage("✅ Disconnected!", msg);
      disableAllControlsExceptConnect();
    });

    _connection.on("error", (err) => logMessage("❌ Connection error:", err));

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
  try {
    _ownerName = await getOwnerName();
    logMessage("😀 Owner:", _ownerName);
    setOwnerInputValue(_ownerName);

    _firmwareVersion = await getFirmwareVersion();
    logMessage("🔧 Firmware version:", _firmwareVersion);

    _javascriptVersion = await getJavascriptVersion();
    logMessage("📦 JS version:", _javascriptVersion);

    _id = await fetchId();
    logMessage("🏷️ ID:", _id);
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
  }

  _connection = null;
}

// Restart the device
async function reboot() {
  if (!_connection || !_connection.isOpen) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  try {
    logMessage("♻️ Rebooting now...");
    await UART.write(" \x03\x03E.reboot()\n");
  } catch (error) {
    logMessage("❌ Error: ", error);
  }

  _connection = null;
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
    return;
  }

  ownerName = ownerName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x00-\x7F]/g, "");

  try {
    await UART.write("\x10settings.userName='';saveSettings();\n");
    await UART.write(
      "\x10settings.userName='" + ownerName + "';saveSettings();\n"
    );

    logMessage("✅ Owner set to:", ownerName);
    logMessage("⚠️ Restart the device to apply changes.");

    _ownerName = ownerName;
    setOwnerInputValue(ownerName);

    enableAllControlsExceptConnect();
  } catch (error) {
    logMessage("❌ Error: ", error);
  }
}

// Reset owner name to empty
async function resetOwnerName() {
  if (!_connection) {
    logMessage("❌ Please connect to the device first.");
    return;
  }

  disableAllControls();

  try {
    await UART.write("\x10settings.userName='';saveSettings();\n");
    await UART.write("\x10delete settings.userName;saveSettings();\n");

    logMessage("✅ Owner name reset!");
    logMessage("⚠️ Restart the device to apply changes.");

    _ownerName = "<NONE>";
    setOwnerInputValue(_ownerName);

    enableAllControlsExceptConnect();
  } catch (error) {
    logMessage("❌ Error: ", error);
  }
}

// Execute a command on the device
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
      logMessage(
        `⚠️ Eval timeout. Retrying (${retries + 1}/${MAX_RETRIES})...`
      );
      return cmd(command, options, retries + 1);
    }
    logMessage("❌ Eval failed:", error.message);
    return null;
  }
}

// Fetch firmware version
async function getFirmwareVersion() {
  return cmd("process.env.VERSION", { flushReceived: true });
}

// Fetch JS version
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

// Fetch owner name
async function getOwnerName() {
  return cmd("typeof(settings)=='object'?settings.userName||'<NONE>':'<NONE>'");
}

// Fetch ID
async function fetchId() {
  return cmd("(typeof(Pip)=='function'&&Pip.getID) ? Pip.getID() : 'Unknown'");
}
