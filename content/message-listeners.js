
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startScraping") {
    chrome.storage.local.set({ people: [] });
    scrapeLinkedIn()
      .then((data) => {})
      .catch((err) => {
        console.error(err);
      });
  }
});
