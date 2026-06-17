// Edit tab
// Split from blood_pressure/index.html. Loaded as a classic script.

let before_dateValue;
let before_periodValue;
let before_itemId;
let currentRow1;

function populateTable(id) {
  const tableBody = document.querySelector("#editTable tbody");
  tableBody.innerHTML = ""; // テーブルをクリア

  const sortedData = getSortedPressureData();
  sortedData.forEach((label) => {
    const rawDate = String(label.date || "");
    const datePart = formatDisplayDate(rawDate); // 日付部分
    const periodPart = label.period; // 朝/夜部分
    const medicinePart = medicineMark(label.medicine);
    const highAlertClass =
      Number(label.high) >= 140 ? "bp-alert-high" : "";
    const lowAlertClass = Number(label.low) <= 70 ? "bp-alert-low" : "";

    const row = `<tr data-item-id="${label.itemId || ""}">
                      <!-- 日付部分: datepickerを使用 -->
                      <td class="date-picker" data-raw-date="${rawDate}">${String(datePart)}</td>
                      <td class="time-picker">${dataArray[periodPart]}</td>

                      <!-- 体重部分: contenteditable -->
                      <td class="high1 ${highAlertClass}">${label.high}</td>
                      <td class="low1 ${lowAlertClass}">${label.low}</td>
                      <td class="medicine1">${medicinePart}</td>

                      <td><button type="button" class="edit-btn">${bt("edit")}</button></td>
                  </tr>`;

    tableBody.insertAdjacentHTML("beforeend", row);
    $(".date-picker").datepicker({
      dateFormat: "yy-mm-dd",
    });
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  const dialog = document.getElementById("editDialog");

  editButtons.forEach((button) => {
    button.addEventListener("click", function () {
      currentRow1 = this.closest("tr");

      // 元の値を取得してダイアログに設定
      const dateCell = currentRow1.querySelector(".date-picker");
      const dateValue =
        dateCell.getAttribute("data-raw-date") || dateCell.innerText;
      const timeValue =
        currentRow1.querySelector(".time-picker").innerText;
      const highValue = currentRow1.querySelector(".high1").innerText;
      const lowValue = currentRow1.querySelector(".low1").innerText;
      const medicineValue =
        currentRow1.querySelector(".medicine1").innerText;

      document.getElementById("editDate").value =
        formatDisplayDate(dateValue);
      document.getElementById("editPeriod").value =
        dataArray.indexOf(timeValue);
      document.getElementById("editHigh").value = highValue;
      document.getElementById("editLow").value = lowValue;
      setMedicineRadioValue("editMedicineStatus", medicineValue);

      before_dateValue = dateValue;
      before_periodValue = dataArray.indexOf(timeValue);
      before_itemId = currentRow1.getAttribute("data-item-id") || "";
      // ダイアログを表示
      dialog.classList.remove("is-hidden");
    });
  });

  const saveButton = document.getElementById("saveButton");
  saveButton.removeEventListener("click", savebutton); // 既存のリスナーを削除
  saveButton.addEventListener("click", savebutton); // 新しいリスナーを登録

  // キャンセルボタンの処理
  document.getElementById("cancelButton").onclick = () => {
    // ダイアログを閉じる
    dialog.classList.add("is-hidden");
  };

  // 削除ボタンの処理
  document.getElementById("deleteButton").onclick = () => {
    const list = {
      date: before_dateValue,
      period: before_periodValue,
    };

    Promise.resolve(deleteData(list, "pressure"))
      .then(() => reloadPressureDataAndRender())
      .then(() => {
        dialog.classList.add("is-hidden");
      })
      .catch((error) => {
        console.error("delete error:", error);
        alert("削除処理でエラーが発生しました。");
      });
  };
}

function savebutton() {
  let dialog = document.getElementById("editDialog");

  // 保存ボタンの処理
  const newDate = document.getElementById("editDate").value;
  const newTime = document.getElementById("editPeriod").value;
  const newHigh = document.getElementById("editHigh").value;
  const newLow = document.getElementById("editLow").value;
  const newMedicine = readMedicineRadioValue("editMedicineStatus");

  if (newDate && newHigh && newTime && newLow) {
    var olddata = {
      date: before_dateValue,
      period: before_periodValue,
    };

    var newdata = {
      itemId: before_itemId,
      date: String(newDate),
      period: parseInt(newTime),
      high: parseInt(newHigh),
      low: parseInt(newLow),
      medicine: newMedicine,
    };
    const sameKey =
      String(olddata.date) === String(newdata.date) &&
      Number(olddata.period) === Number(newdata.period);

    const savePressure =
      typeof setPressure === "function"
        ? setPressure
        : (payload) => addData(payload, "pressure");
    const updatePressure =
      typeof putData === "function"
        ? putData
        : (payload) => addData(payload, "pressure");
    const request = sameKey
      ? Promise.resolve(updatePressure(newdata, "pressure"))
      : Promise.resolve(updatePressure(newdata, "pressure")).then(() =>
          deleteData(olddata, "pressure"),
        );

    request
      .then(() => {
        // 保存後は再取得して表示を揃える
        return reloadPressureDataAndRender();
      })
      .then(() => {
        dialog.classList.add("is-hidden");
      })
      .catch((error) => {
        console.error("save/update error:", error);
        alert("保存処理でエラーが発生しました。");
      });
  } else {
    alert(bt("fillAll"));
  }
  //                allData = allData.filter(item => !(item.date == before_dateValue && item.period ==
  //                    before_periodValue));

  //               allData.push({
  //                   date: newDate,
  //                   period: newTime,
  //                   high: newHigh,
  //                   low: newLow
  //               })
}

function createTablePage() {
  const tableBody = document.querySelector("#table tbody");
  tableBody.innerHTML = ""; // テーブルをクリア

  const sortedData = getSortedPressureData();
  sortedData.forEach((label) => {
    const datetime = formatDisplayDate(label.date);
    const medicinePart = medicineMark(label.medicine);
    const highAlertClass =
      Number(label.high) >= 140 ? "bp-alert-high" : "";
    const lowAlertClass = Number(label.low) <= 70 ? "bp-alert-low" : "";
    const row = `<tr>
              <!-- 日付部分: datepickerを使用 -->
              <td>${datetime}</td>
              <td>${dataArray[label.period]}</td>
              <!-- 最高血圧部分: contenteditable -->
              <td class="${highAlertClass}">${label.high}</td>
              <td class="${lowAlertClass}">${label.low}</td>
              <td>${medicinePart}</td>

          </tr>`;

    tableBody.insertAdjacentHTML("beforeend", row);
    $(".date-picker").datepicker({
      dateFormat: "yy-mm-dd HH:mm",
    });
  });
}

function setallData() {
  allData = allData.filter(
    (item) =>
      !(
        item.date == before_dateValue && item.period == before_periodValue
      ),
  );
  if (currentRow1) currentRow1.remove();
}
document.addEventListener("language-changed", function (event) {
  setLanguage(window.normalizedLanguageCode || "");
});
$(function () {
  applyI18n();
  bootPressureApp();
});
