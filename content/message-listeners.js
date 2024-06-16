
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "startScraping") {
    chrome.storage.local.set({ jobs: [] });
    scrapeLinkedInJobs()
      .then((data) => {})
      .catch((err) => {
        console.error(err);
      });
  }
});
