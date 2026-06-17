// Edit tab
// Split from blood_sugar/index.html. Loaded as a classic script.

function populateTable() {
  const tableBody = document.querySelector("#editTable tbody");
  tableBody.innerHTML = "";
  getSortedSugarData().forEach((label) => {
    const rawDate = String(label.date || "");
    const itemId = resolveItemId(label);
    const alertClass = isSugarAlert(label) ? "sugar-alert" : "";
    const row = `<tr>
              <td class="date-picker" data-raw-date="${rawDate}" data-item-id="${itemId}">${formatDisplayDate(rawDate)}</td>
              <td class="time-picker">${periodLabel(label.period)}</td>
              <td class="sugar1 ${alertClass}">${label.sugar}</td>
              <td class="medication1">${medicationDisplayText(label)}</td>
              <td><button type="button" class="edit-btn">${bt("edit")}</button></td>
          </tr>`;
    tableBody.insertAdjacentHTML("beforeend", row);
  });
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function () {
      currentRow1 = this.closest("tr");
      const dateCell = currentRow1.querySelector(".date-picker");
      const dateValue =
        dateCell.getAttribute("data-raw-date") || dateCell.innerText;
      const itemId = dateCell.getAttribute("data-item-id") || "";
      const timeValue =
        currentRow1.querySelector(".time-picker").innerText;
      const sugarValue = currentRow1.querySelector(".sugar1").innerText;
      const medicationValue =
        currentRow1.querySelector(".medication1").innerText;
      document.getElementById("editDate").value =
        formatDisplayDate(dateValue);
      document.getElementById("editPeriod").value =
        findPeriodValueFromLabel(timeValue);
      document.getElementById("editSugar").value = sugarValue;
      setMedicationStatus(
        "editMedicationStatus",
        medicationValue.startsWith("○") ? "yes" : "none",
      );
      document.getElementById("editMedicationUnit").value =
        medicationValue.startsWith("○")
          ? medicationValue.replace(/^○\s*/, "")
          : "";
      syncMedicationUnitVisibility();
      currentItemId = itemId;
      before_dateValue = dateValue;
      before_periodValue = findPeriodValueFromLabel(timeValue);
      document.getElementById("editDialog").classList.remove("is-hidden");
    });
  });
  document.getElementById("saveButton").onclick = savebutton;
  document.getElementById("cancelButton").onclick = function () {
    currentItemId = "";
    document.getElementById("editDialog").classList.add("is-hidden");
  };
  document.getElementById("deleteButton").onclick = function () {
    const list = {
      date: before_dateValue,
      period: before_periodValue,
    };
    Promise.resolve(deleteData(list, "mySugar"))
      .then(() => reloadSugarDataAndRender())
      .then(() => {
        currentItemId = "";
        document.getElementById("editDialog").classList.add("is-hidden");
      })
      .catch((error) => {
        console.error("delete sugar error:", error);
        alert("削除処理でエラーが発生しました。");
      });
  };
}
 function findPeriodValueFromLabel(labelText) {
  for (let i = 1; i <= 7; i++) {
    if (periodLabel(i) === labelText) return i;
  }
  return 1;
}
 function savebutton() {
  const newDate = document.getElementById("editDate").value;
  const newPeriod = Number(document.getElementById("editPeriod").value);
  const newSugar = Number(document.getElementById("editSugar").value);
  const medicationStatus = readMedicationStatus("editMedicationStatus");
  const medicationUnit = String(
    document.getElementById("editMedicationUnit").value || "",
  ).trim();
  if (
    !newDate ||
    !Number.isFinite(newPeriod) ||
    !Number.isFinite(newSugar)
  ) {
    alert(bt("fillAll"));
    return;
  }
  const numericItemId = Number(currentItemId);
  if (!Number.isFinite(numericItemId)) {
    alert(
      "識別IDが取得できません。画面を再読み込みしてからもう一度お試しください。",
    );
    return;
  }
  const newdata = {
    itemId: numericItemId,
    date: String(newDate),
    period: newPeriod,
    sugar: Math.round(newSugar),
    medicine:
      medicationStatus === "yes"
        ? Number.parseFloat(medicationUnit) || 0
        : 0,
  };
  const updateSugar =
    typeof putData === "function"
      ? putData
      : (payload, type) => addData(payload, type);
  const request = Promise.resolve(updateSugar(newdata, "mySugar"));
  request
    .then(() => reloadSugarDataAndRender())
    .then(() => {
      currentItemId = "";
      document.getElementById("editDialog").classList.add("is-hidden");
    })
    .catch((error) => {
      console.error("save sugar error:", error);
      alert("保存処理でエラーが発生しました。");
    });
}
 function setallData() {
  allData = (Array.isArray(allData) ? allData : []).filter(
    (item) =>
      !(
        String(item.date || "") === String(before_dateValue || "") &&
        Number(item.period || 0) === Number(before_periodValue || 0)
      ),
  );
  if (currentRow1 && currentRow1.remove) currentRow1.remove();
}
// Startup and events
const ctx = document.getElementById("bloodSugarChart").getContext("2d");
bloodSugarChart = new Chart(ctx, buildSugarChartConfig());
$(function () {
  $("#date").datepicker({
    dateFormat: "yy/mm/dd",
  });
  $(".datepicker2").datepicker({
    dateFormat: "yy-mm-dd",
  });
});
document.getElementById("adddata").onclick = function () {
  try {
    const date = document.getElementById("date").value.trim();
    const period = Number(document.getElementById("periodSelect").value);
    const sugar = Number(document.getElementById("sugar").value);
    const medicationStatus = readMedicationStatus("medicationStatus");
    const medicationUnit = String(
      document.getElementById("medicationUnit").value || "",
    ).trim();
    if (!date || !Number.isFinite(period) || !Number.isFinite(sugar)) {
      alert(bt("fillAll"));
      return;
    }
    const list = {
      date: String(date),
      period: period,
      sugar: Math.round(sugar),
      medicine:
        medicationStatus === "yes"
          ? Number.parseFloat(medicationUnit) || 0
          : 0,
    };
    const saveSugar =
      typeof setSugar === "function"
        ? setSugar
        : (payload) => addData(payload, "mySugar");
    Promise.resolve(saveSugar(list))
      .then(() => reloadSugarDataAndRender())
      .then(() => {
        switchTab("chart-container", {
          currentTarget: document.getElementById("tabChart"),
        });
        document.getElementById("date").value = "";
        document.getElementById("sugar").value = "";
        setMedicationStatus("medicationStatus", "none");
        document.getElementById("medicationUnit").value = "";
        syncMedicationUnitVisibility();
        closeAddForm();
      })
      .catch((e) => {
        console.error("add sugar error:", e);
        alert("登録処理でエラーが発生しました。");
      });
  } catch (e) {
    console.error("add sugar exception:", e);
    alert("登録処理でエラーが発生しました。");
  }
};
document
  .getElementById("openAddFormBtn")
  .addEventListener("click", openAddForm);
document
  .getElementById("closeAddFormBtn")
  .addEventListener("click", closeAddForm);
document
  .getElementById("loadOlderChartBtn")
  .addEventListener("click", loadOlderSugarData);
document
  .getElementById("loadOlderTableBtn")
  .addEventListener("click", loadOlderSugarData);
document
  .getElementById("loadOlderEditBtn")
  .addEventListener("click", loadOlderSugarData);
document
  .querySelectorAll(
    'input[name="medicationStatus"], input[name="editMedicationStatus"]',
  )
  .forEach((el) => {
    el.addEventListener("change", syncMedicationUnitVisibility);
  });
syncMedicationUnitVisibility();

const baseSwitchTab = window.switchTab;
window.switchTab = function (contentId, event) {
  if (contentId !== "chart-container") {
    closeAddForm();
  }
  return baseSwitchTab(contentId, event);
};
$(function () {
  const initialSavedLang = localStorage.getItem(LANG_STORAGE_KEY);
  const browserLang = normalizeLangToUi(navigator.language || "en-US");
  selectedUiLang = isSupportedLang(initialSavedLang)
    ? initialSavedLang
    : browserLang;
  localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
  sugarI18nReady = initI18n(selectedUiLang)
    .then(() => {
      applyI18n();
    })
    .catch((error) => {
      console.error("blood sugar i18n init failed:", error);
    });
  bootSugarApp();
  document.addEventListener("language-changed", function (event) {
    setLanguage(window.normalizedLanguageCode || normalizeLangToUi(event.detail && event.detail.langId));
  });
});
