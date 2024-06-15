document.addEventListener("DOMContentLoaded", function () {
  let table;

  initializeDataTable();

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

      if (jobs) {
        // Clear existing table rows
        const tableBody = document.getElementById("jobsTableBody");
        table.clear().draw();

        // Create table rows from the jobs data
        table.row.add([jobs]).draw();
      }
    });
  }
});

document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("jobs", function () {
      location.reload(); // Reload the page
    });
  });
