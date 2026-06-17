// Table tab and input form
// Split from blood_pressure/index.html. Loaded as a classic script.

function switchTab(contentId, event) {
  document
    .querySelectorAll(
      ".chart-container, .table-container, .edit-container",
    )
    .forEach((content) => {
      content.classList.remove("active-content");
    });
  const chartContainerAll = document.getElementById(
    "chart-container-all",
  );
  if (chartContainerAll) {
    chartContainerAll.style.display =
      contentId === "chart-container" ? "block" : "none";
  }
  const nextContent = document.getElementById(contentId);
  if (nextContent) {
    nextContent.classList.add("active-content");
  }

  const buttons = document.querySelectorAll(".tab-bar button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  if (event && event.currentTarget) {
    event.currentTarget.classList.add("active");
  }

  try {
    if (
      contentId === "table-container" &&
      typeof createTablePage === "function"
    ) {
      createTablePage();
    } else if (
      contentId === "edit-container" &&
      typeof populateTable === "function"
    ) {
      populateTable(contentId);
    } else if (typeof updateChart === "function") {
      updateChart(allData);
    }
  } catch (e) {
    console.error("switchTab rendering error:", e);
  }
  if (typeof updateGraphUnitButtonVisibility === "function") {
    updateGraphUnitButtonVisibility();
  }
}

// jQuery UIのdatepickerの初期化
$(function () {
  $("#date").datepicker({
    dateFormat: "yy/mm/dd",
  });
});

function openAddForm() {
  const panel = document.getElementById("addFormPanel");
  const openBtn = document.getElementById("openAddFormBtn");
  if (!panel) return;
  panel.classList.add("open");
  panel.style.maxHeight = "520px";
  panel.style.opacity = "1";
  panel.style.transform = "translateY(0)";
  panel.setAttribute("aria-hidden", "false");
  if (openBtn) openBtn.style.display = "none";
}

function closeAddForm() {
  const panel = document.getElementById("addFormPanel");
  const openBtn = document.getElementById("openAddFormBtn");
  if (!panel) return;
  panel.classList.remove("open");
  panel.style.maxHeight = "0";
  panel.style.opacity = "0";
  panel.style.transform = "translateY(-8px)";
  panel.setAttribute("aria-hidden", "true");
  if (openBtn) openBtn.style.display = "";
}

function openSettingsDialog() {
  const dlg = document.getElementById("settingsDialog");
  if (!dlg) return;
  dlg.classList.remove("is-hidden");
}

function closeSettingsDialog() {
  const dlg = document.getElementById("settingsDialog");
  if (!dlg) return;
  dlg.classList.add("is-hidden");
}

function addClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("click", handler);
}

addClick("guideToggleBtn", () => {
  showGuideOverlay = !showGuideOverlay;
  localStorage.setItem(GUIDE_VISIBLE_KEY, showGuideOverlay ? "1" : "0");
  applySettingsUi();
  updateChart(allData);
});
addClick("openAddFormBtn", openAddForm);
addClick("closeAddFormBtn", closeAddForm);
addClick("loadOlderChartBtn", loadOlderPressureData);
addClick("loadOlderTableBtn", loadOlderPressureData);
addClick("loadOlderEditBtn", loadOlderPressureData);

document.getElementById("adddata").onclick = function () {
  try {
    const date = document.getElementById("date").value.trim();
    const time = Number(document.getElementById("periodSelect").value);
    const high = Number(document.getElementById("higth").value);
    const low = Number(document.getElementById("low").value);
    const medicine = readMedicineRadioValue("medicineStatus");

    if (
      !date ||
      !Number.isFinite(time) ||
      !Number.isFinite(high) ||
      !Number.isFinite(low)
    ) {
      alert(bt("fillAll"));
      return;
    }

    const list = {
      date: String(date),
      period: time,
      high: Math.round(high),
      low: Math.round(low),
      medicine: medicine,
    };

    if (typeof addData !== "function") {
      alert(
        "登録処理の読み込みに失敗しました。ページを再読み込みしてください。",
      );
      return;
    }
    const savePressure =
      typeof setPressure === "function"
        ? setPressure
        : (payload) => addData(payload, "myPressure");
    Promise.resolve(savePressure(list))
      .then(() => {
        return reloadPressureDataAndRender();
      })
      .then(() => {
        switchTab("chart-container", {
          currentTarget: document.getElementById("tabChart"),
        });
        document.getElementById("date").value = "";
        document.getElementById("higth").value = "";
        document.getElementById("low").value = "";
        setMedicineRadioValue("medicineStatus", 0);
        closeAddForm();
      })
      .catch((e) => {
        console.error("add/register error:", e);
        alert("登録処理でエラーが発生しました。");
      });
  } catch (e) {
    console.error("adddata error:", e);
    alert("登録処理でエラーが発生しました。");
  }
};
