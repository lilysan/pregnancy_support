// Table tab and input form
// Split from blood_sugar/index.html. Loaded as a classic script.

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
