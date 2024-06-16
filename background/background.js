chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "person") {
    chrome.storage.local.get('people', function (result) {
      const existing = result.people || [];
      const newPeople = [...existing, message.message];
      chrome.storage.local.set({ people: newPeople });
    });
  }
});
