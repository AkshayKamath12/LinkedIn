function sendJob(job) {
  chrome.runtime.sendMessage({ action: "job", message: job });
}

async function scrapeJobDetails(card) {
  card.click();

  await new Promise((resolve) => setTimeout(resolve, 300));

  const job = document.querySelector(".job-details-jobs-unified-top-card__job-title").innerText;

  return job;
}

async function scrapeLinkedInJobs() {
   const cards = document.querySelectorAll(".job-card-container");
   const cardCount = cards.length;
   for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      const jobDetails = await scrapeJobDetails(cards[cardIndex]);
      sendJob(jobDetails);
   }
}
