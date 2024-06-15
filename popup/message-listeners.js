chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "popupMessage") {
    const statusMessage = document.getElementById("statusMessage");
    statusMessage.textContent = message.message;
  }
});

