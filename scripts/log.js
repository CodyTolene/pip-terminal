function logDisclaimer() {
  logMessage(
    "⚖️ Bethesda Softworks, LLC. All trademarks, logos, and " +
      "brand names are the property of their respective owners. " +
      "This project is for personal use only and is not intended " +
      "for commercial purposes. Use of any materials is at your " +
      "own risk."
  );
}

function logMessage(message, additionalInfo = null) {
  let logDiv = document.getElementById("log");
  let newMessage = document.createElement("p");

  newMessage.innerText =
    additionalInfo !== null ? `${message} ${additionalInfo}` : message;

  logDiv.appendChild(newMessage);

  // Scroll to the bottom of the log
  logDiv.scrollTop = logDiv.scrollHeight;
}

function logLink(label, url) {
  let logDiv = document.getElementById("log");
  let newMessage = document.createElement("p");
  let textNode = document.createTextNode(label + ": ");
  let link = document.createElement("a");

  link.href = url;
  link.innerText = url;
  link.target = "_blank"; // Open in new tab

  newMessage.appendChild(textNode);
  newMessage.appendChild(link);

  logDiv.appendChild(newMessage);

  // Scroll to the bottom of the log
  logDiv.scrollTop = logDiv.scrollHeight;
}
