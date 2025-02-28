$(document).ready(function () {
  $("#fileInput").on("change", function () {
    const file = this.files[0];
    if (file && file.name.split(".").pop().toLowerCase() !== "zip") {
      alert("❌ Please select a valid .zip file.");
      this.value = ""; // Reset file input
      $("#upgradeButton").prop("disabled", true);
    } else {
      $("#upgradeButton").prop("disabled", false);
    }
  });
});

// Set owner name on the input field
function setOwnerInputValue(value) {
  let valueParsed = value === "<NONE>" ? "" : value;
  $("#ownerName").val(valueParsed);
}

// Disable all controls
function disableAllControls() {
  $("#connectButton").prop("disabled", true);
  $("#restartButton").prop("disabled", true);
  $("#ownerName").prop("disabled", true);
  $("#saveNameButton").prop("disabled", true);
  $("#resetNameButton").prop("disabled", true);
  $("#fileInput").prop("disabled", true);
  $("#upgradeButton").prop("disabled", true);
  $("#disconnectButton").prop("disabled", true);
  $("#shutdownButton").prop("disabled", true);
  $("#sleepButton").prop("disabled", true);
  $("#wakeButton").prop("disabled", true);
}

// Enable all controls except "Connect" when connected.
function enableAllControlsExceptConnect() {
  $("#connectButton").prop("disabled", true);
  $("#restartButton").prop("disabled", false);
  $("#ownerName").prop("disabled", false);
  $("#saveNameButton").prop("disabled", false);
  $("#resetNameButton").prop("disabled", false);
  $("#fileInput").prop("disabled", false);
  $("#disconnectButton").prop("disabled", false);
  $("#shutdownButton").prop("disabled", false);
  $("#sleepButton").prop("disabled", false);
  $("#wakeButton").prop("disabled", false);
}

// Disable all controls except "Connect" when disconnected.
function disableAllControlsExceptConnect() {
  $("#connectButton").prop("disabled", false);
  $("#restartButton").prop("disabled", true);
  $("#ownerName").prop("disabled", true);
  $("#saveNameButton").prop("disabled", true);
  $("#resetNameButton").prop("disabled", true);
  $("#fileInput").prop("disabled", true);
  $("#upgradeButton").prop("disabled", true);
  $("#disconnectButton").prop("disabled", true);
  $("#shutdownButton").prop("disabled", true);
  $("#sleepButton").prop("disabled", true);
  $("#wakeButton").prop("disabled", true);
}

// Set controls when the device is awakened
function setIsAwakeControls() {
  $("#sleepButton").prop("disabled", false);
  $("#wakeButton").prop("disabled", true);
}

// Set controls when the device is put asleep
function setIsAsleepControls() {
  $("#sleepButton").prop("disabled", true);
  $("#wakeButton").prop("disabled", false);
}

// Disable all sleep and awake controls
function disableSleepAwakeControls() {
  $("#sleepButton").prop("disabled", true);
  $("#wakeButton").prop("disabled", true);
}
