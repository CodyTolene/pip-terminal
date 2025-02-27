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
  $("#rebootButton").prop("disabled", true);
  $("#ownerName").prop("disabled", true);
  $("#saveNameButton").prop("disabled", true);
  $("#resetNameButton").prop("disabled", true);
  $("#fileInput").prop("disabled", true);
  $("#upgradeButton").prop("disabled", true);
  $("#disconnectButton").prop("disabled", true);
}

// Enable all controls except "Connect" when connected.
function enableAllControlsExceptConnect() {
  $("#connectButton").prop("disabled", true);
  $("#rebootButton").prop("disabled", false);
  $("#ownerName").prop("disabled", false);
  $("#saveNameButton").prop("disabled", false);
  $("#resetNameButton").prop("disabled", false);
  $("#fileInput").prop("disabled", false);
  $("#disconnectButton").prop("disabled", false);
}

// Disable all controls except "Connect" when disconnected.
function disableAllControlsExceptConnect() {
  $("#connectButton").prop("disabled", false);
  $("#rebootButton").prop("disabled", true);
  $("#ownerName").prop("disabled", true);
  $("#saveNameButton").prop("disabled", true);
  $("#resetNameButton").prop("disabled", true);
  $("#fileInput").prop("disabled", true);
  $("#upgradeButton").prop("disabled", true);
  $("#disconnectButton").prop("disabled", true);
}
