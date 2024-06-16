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

async function scrapeDetails(card) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let name2 = document.getElementsByClassName("mn-connection-card__name t-16 t-black t-bold")[0];
  return name2.innerText;
/*
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const name = document.querySelector(".sJtaHDGAOHgMBRBByxxfEzvZhRAFdozhPM");
  
  if(name){
     return name.innerText; 
  }
  let name2 = "";
  return name2;
  */
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

  
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    
    await scrollProgressively();
    const cards = document.querySelectorAll(".mn-connection-card__picture");
    const cardCount = cards.length;
    console.log(cardCount);
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
      const name2 = document.getElementsByClassName("mn-connection-card__name t-16 t-black t-bold");
      console.log(name2.length);
      const name = await scrapeDetails(cards[cardIndex]);
      //sendJob(name);
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
    const people = document.querySelectorAll(".mn-connection-card__picture");
    const peopleCount = people.length;
    people[peopleCount - 1].scrollIntoView({ behaviour: "smooth" });
    setTimeout(async () => {
      if (
        document.querySelectorAll(".mn-connection-card__picture").length != peopleCount
      ) {
        res(scrollProgressively());
      } else {
        return res({ status: "end of scroll" });
      }
    }, timeToCall);
  });
}
