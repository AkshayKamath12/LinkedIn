function sendJob(job) {
  chrome.runtime.sendMessage({ action: "job", message: job });
}

function sendMessageToPopup(message) {
  chrome.runtime.sendMessage({ action: "popupMessage", message: message });
}

/*
function sendProgressPercentage(progressPercentage) {
  chrome.runtime.sendMessage({
    action: "progressPercentage",
    message: progressPercentage,
  });
}

function simulateRealScrollToEnd(element, duration) {
  const startScrollTop = element.scrollTop;
  const endScrollTop = element.scrollHeight - element.clientHeight;

  const startTime = performance.now();
  const endTime = startTime + duration;

  function scrollStep(timestamp) {
    const currentTime = Math.min(timestamp, endTime);
    const elapsedTime = currentTime - startTime;
    const scrollFraction = elapsedTime / duration;
    const scrollTop =
      startScrollTop + (endScrollTop - startScrollTop) * scrollFraction;

    element.scrollTop = scrollTop;

    if (currentTime < endTime) {
      window.requestAnimationFrame(scrollStep);
    }
  }

  window.requestAnimationFrame(scrollStep);
}
*/
async function scrapeJobDetails(card) {
  card.click();

  await new Promise((resolve) => setTimeout(resolve, 500));

  const jobTitle = document.querySelector(".job-details-jobs-unified-top-card__job-title").innerText;

  return jobTitle;
}

async function scrapeLinkedInJobs() {
  const cards = document.querySelectorAll(".job-card-container");
  const cardCount = cards.length;
  for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
    const jobDetails = await scrapeJobDetails(cards[cardIndex]);
    sendJob(jobDetails);
  }

}


