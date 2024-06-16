function sendJob(job) {
  chrome.runtime.sendMessage({ action: "job", message: job });
}

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


async function changePage(pageNumber) {
  // click button
  const pageButton = document.querySelector(
    `button[aria-label="Page ${pageNumber}"]`
  );
  pageButton.click();

  await new Promise((resolve) => setTimeout(resolve, 3000));
}

async function scrapeLinkedInJobs() {
  const connectionsURL = document.getElementById("ember199").href;
  windows.location.href = connectionsURL;
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
    const names = document.getElementsByClassName("mn-connection-card__name t-16 t-black t-bold");
    const descriptions = document.getElementsByClassName("mn-connection-card__occupation t-14 t-black--light t-normal");
    for (let cardIndex = 0; cardIndex < cardCount; cardIndex++) {
        const personName = names[cardIndex].innerText;
        const descr = descriptions[cardIndex].innerText;
        console.log(personName);
        console.log(descr);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        sendJob({personName, descr});
        const cardProgressPercentage = Math.round(((cardIndex + 1) / cardCount) * 100);
        const pageProgressPercentage = Math.round((pageIndex / pageCount) * 100);
        const overallProgressPercentage = Math.round(
        pageProgressPercentage + cardProgressPercentage / pageCount);
        sendProgressPercentage(overallProgressPercentage);
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
