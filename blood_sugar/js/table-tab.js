// Table tab and input form
// Split from blood_sugar/index.html. Loaded as a classic script.

function switchTab(contentId, event) {
  const chartWrapper = document.getElementById("chart-container-all");
  const tableContainer = document.getElementById("table-container");
  const editContainer = document.getElementById("edit-container");
  const panels = {
    "chart-container": chartWrapper,
    "table-container": tableContainer,
    "edit-container": editContainer,
  };

  Object.values(panels).forEach((panel) => {
    if (panel) panel.classList.remove("active-content");
  });

  document
    .querySelectorAll(".chart-container, .table-container, .edit-container")
    .forEach((content) => content.classList.remove("active-content"));

  const selectedPanel = panels[contentId] || document.getElementById(contentId);
  if (selectedPanel) selectedPanel.classList.add("active-content");

  if (contentId === "chart-container") {
    const chartContainer = document.getElementById("chart-container");
    if (chartContainer) chartContainer.classList.add("active-content");
    if (bloodSugarChart) {
      updateChartRangeTitle();
      if (typeof updateChart === "function") {
        updateChart(allData);
      }
      bloodSugarChart.resize();
    }
  }

  document
    .querySelectorAll(".tab-bar button")
    .forEach((button) => button.classList.remove("active"));
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }

  try {
    if (contentId === "table-container" && typeof createTablePage === "function") {
      createTablePage();
    } else if (contentId === "edit-container" && typeof populateTable === "function") {
      populateTable();
    }
  } catch (e) {
    console.error("switchTab rendering error:", e);
  }
}

function createTablePage() {
  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = "";
  getSortedSugarData().forEach((label) => {
    const alertClass = isSugarAlert(label) ? "sugar-alert" : "";
    const row = `<tr>
              <td>${formatDisplayDate(label.date)}</td>
              <td>${periodLabel(label.period)}</td>
              <td class="${alertClass}">${label.sugar}</td>
              <td>${medicationDisplayText(label)}</td>
          </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
}

function openAddForm() {
  const panel = document.getElementById("addFormPanel");
  const openBtn = document.getElementById("openAddFormBtn");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  openBtn.style.display = "none";
}
 function closeAddForm() {
  const panel = document.getElementById("addFormPanel");
  const openBtn = document.getElementById("openAddFormBtn");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  openBtn.style.display = "block";
}
