document.addEventListener("DOMContentLoaded", function () {
  let table;

  initializeDataTable();

  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "local" && changes.people) {
      loadTable();
    }
  });

  function initializeDataTable() {
    table = $("#jobsTable").DataTable({
      paging: false,
      searching: true,
      info: true,
    });

    loadTable();
  }

  function loadTable() {
    
    chrome.storage.local.get("people", function (result) {
      const people = result.people;

      if (people && people.length > 0) {
        const tableBody = document.getElementById("jobsTableBody");
        table.clear().draw();
        people.forEach(function (person) {
            table.row.add([person.personName, person.descr]).draw();
        });
      }
    });
  }
});
   function tableToCSV() {
      var csv = [];
      var rows = document.querySelectorAll("table tr");

      for (var i = 0; i < rows.length; i++) {
         var row = [], cols = rows[i].querySelectorAll("td, th");

         for (var j = 0; j < cols.length; j++){ 
            row.push(cols[j].innerText);
         }
            csv.push(row.join(","));      
      }

                // Download CSV file
      downloadCSV(csv.join("\n"), "result");
 
   }
 
   function downloadCSV(csv, filename) {
 
      var csvFile;
      var csvFile;
      var downloadLink;

      csvFile = new Blob([csv], {
         type: "text/csv"
      });

      downloadLink = document.createElement("a");
      downloadLink.download = filename;
      downloadLink.href = window.URL.createObjectURL(csvFile);

      downloadLink.style.display = "none";

      document.body.appendChild(downloadLink);

      downloadLink.click();
   }
       
document
  .getElementById("clearLocalStorageButton")
  .addEventListener("click", function () {
    chrome.storage.local.remove("people", function () {
      location.reload(); // Reload the page
    });
  });
  
document
  .getElementById("downloadCSV")
  .addEventListener("click", function () {
    tableToCSV();
  });
