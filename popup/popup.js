document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startButton").disabled = true;
  document.getElementById("progressBar").style.display = "block";
  document.getElementById("progressBar").value = 0;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0].id;
    chrome.tabs.sendMessage(tabId, { action: "startScraping" });
  });
});

document
  .getElementById("openSearchPageButton")
  .addEventListener("click", () => {
    var pageURL = chrome.runtime.getURL("search/search-page.html");
    chrome.tabs.create({ url: pageURL });
  });


