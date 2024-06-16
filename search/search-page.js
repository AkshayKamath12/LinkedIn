document.addEventListener("DOMContentLoaded", function () {
  let table;

  initializeDataTable();

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "local" && changes.jobs) {
      loadJobsTable();
    }
  });

  function initializeDataTable() {
    table = $("#jobsTable").DataTable({
      paging: false,
      searching: true,
      info: true,
    });

    loadJobsTable();
  }

  function loadJobsTable() {
    
    chrome.storage.local.get("jobs", function (result) {
      const jobs = result.jobs;

      if (jobs && jobs.length > 0) {
        const tableBody = document.getElementById("jobsTableBody");
        table.clear().draw();
        jobs.forEach(function (job) {
            table.row.add([job.personName, job.descr]).draw();
        });
      }
    });
  }
});

document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("jobs", function () {
      // Handle the removal of "jobs" from chrome.storage.local
      location.reload(); // Reload the page
    });
  });
