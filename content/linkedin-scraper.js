function sendJob(job) {
  chrome.runtime.sendMessage({ action: "job", message: job });
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

async function scrapeJobDetails(card) {
  card.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const job = document.querySelector(
    ".job-details-jobs-unified-top-card__job-title"
  ).innerText;


  return job;
}

async function changePage(pageNumber) {
  // click button
  const pageButton = document.querySelector(
    `button[aria-label="Page ${pageNumber}"]`
  );
  pageButton.click();

  await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function scrapeLinkedInJobs() {
  //const pageButton = document.querySelector(".search-global-typeahead__collapsed-search-button");
  //pageButton.click();
  const pageCountElements = [
    ...document.querySelectorAll(".artdeco-pagination__indicator"),
  ];

  const pageCount =
    pageCountElements.length > 0
      ? parseInt(
          pageCountElements[pageCountElements.length - 1].textContent.trim()
        )
      : 1;

  console.log("testing");
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    //await scrollProgressively();
    const cards = document.querySelectorAll(".display-flex align-items-center");
    const cardCount = cards.length;
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      page = cards[cardIndex]
      page.click()
      const name = document.querySelect(".text-heading-xlarge").innerText;
      console.log(name);
      sendJob(name);
    }

    if (pageIndex < pageCount - 1) {
      await changePage(pageIndex + 2);
    }
  }
  
  /*
  const pageCountElements = [
    ...document.querySelectorAll(".artdeco-pagination__indicator"),
  ];

  const pageCount =
    pageCountElements.length > 0
      ? parseInt(
          pageCountElements[pageCountElements.length - 1].textContent.trim()
        )
      : 1;

    
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const cardsListElement = document.querySelector(
      ".jobs-search-results-list"
    );
    await scrollProgressively();
    const cards = document.querySelectorAll(".job-card-container--clickable");
    const cardCount = cards.length;
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      const jobDetails = await scrapeJobDetails(cards[cardIndex]);

      sendJob(jobDetails);
    }

    if (pageIndex < pageCount - 1) {
      await changePage(pageIndex + 2);
    }
  }
  */
}

function scrollProgressively() {
  const timeToCall = 2000;
  return new Promise((res) => {
    const jobs = document.querySelectorAll(".job-card-container");
    const jobsCount = jobs.length;
    jobs[jobsCount - 1].scrollIntoView({ behaviour: "smooth" });
    setTimeout(async () => {
      if (
        document.querySelectorAll(".job-card-container").length != jobsCount
      ) {
        res(scrollProgressively());
      } else {
        return res({ status: "end of scroll" });
      }
    }, timeToCall);
  });
}
