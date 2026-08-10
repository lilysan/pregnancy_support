// Form, edit dialog, and page boot for weight. Loaded as a classic script.

function openEditDialog(itemId, datetime) {
    const item = allData.find(function (entry) {
        const entryItemId = resolveItemId(entry);
        return (itemId && String(entryItemId) === String(itemId)) || String(entry.datetime) === String(datetime);
    });
    if (!item) return;

    editingItemId = resolveItemId(item);
    editingDatetime = datetime;
    const datePart = String(item.datetime).split(" ")[0];
    const timePart = String(item.datetime).split(" ")[1] || "06:00";
    const period = timePart === "12:00" ? "2" : (timePart === "18:00" ? "3" : "1");
    document.getElementById("editWeightDate").value = datePart;
    document.getElementById("editWeightPeriod").value = period;
    document.getElementById("editWeightValue").value = Number(item.weight).toFixed(1);
    document.getElementById("editDialog").style.display = "flex";
}

function closeEditDialog() {
    document.getElementById("editDialog").style.display = "none";
    editingItemId = "";
    editingDatetime = "";
}


function loadMetaToForm() {
    const meta = getMeta();
    document.getElementById("periodStartDate").value = meta.startDate || "";
    document.getElementById("startWeightKg").value = Number.isFinite(meta.startWeightKg) ? meta.startWeightKg :
        "";
    document.getElementById("targetEndDate").value = meta.endDate || "";
    document.getElementById("targetGainKg").value = Number.isFinite(meta.targetGainKg) ? meta.targetGainKg : "";
}

function savePlanLocallyFromForm() {
    const startDate = document.getElementById("periodStartDate").value;
    const startWeightKg = parseFloat(document.getElementById("startWeightKg").value);
    const endDate = document.getElementById("targetEndDate").value;
    const targetGainKg = parseFloat(document.getElementById("targetGainKg").value);
    if (!startDate || !endDate || !Number.isFinite(startWeightKg) || !Number.isFinite(targetGainKg)) return false;
    if (parseDateOnly(endDate).getTime() < parseDateOnly(startDate).getTime()) return false;
    saveMeta({
        periodId: currentPeriod && currentPeriod.periodId ? currentPeriod.periodId : "",
        startDate: startDate,
        startWeightKg: Number(startWeightKg.toFixed(1)),
        endDate: endDate,
        targetGainKg: Number(targetGainKg.toFixed(1))
    });
    renderSummary();
    updateChart();
    return true;
}

async function savePlan() {
    const startDate = document.getElementById("periodStartDate").value;
    const startWeightKg = parseFloat(document.getElementById("startWeightKg").value);
    const endDate = document.getElementById("targetEndDate").value;
    const targetGainKg = parseFloat(document.getElementById("targetGainKg").value);

    if (!startDate || !endDate || !Number.isFinite(startWeightKg) || !Number.isFinite(targetGainKg)) {
        alert(bt("promptFillPlan"));
        return;
    }
    if (parseDateOnly(endDate).getTime() < parseDateOnly(startDate).getTime()) {
        alert(bt("promptInvalidDate"));
        return;
    }

    const isExistingPeriod = currentPeriod && currentPeriod.periodId !== "";
    const payload = {
        type: "period",
        startDate: startDate,
        startWeightKg: Number(startWeightKg.toFixed(1)),
        endDate: endDate,
        targetGainKg: Number(targetGainKg.toFixed(1))
    };
    if (isExistingPeriod) {
        payload.periodId = currentPeriod.periodId;
    }
    saveMeta({
        periodId: payload.periodId || (currentPeriod && currentPeriod.periodId) || "",
        startDate: payload.startDate,
        startWeightKg: payload.startWeightKg,
        endDate: payload.endDate,
        targetGainKg: payload.targetGainKg
    });
    loadMetaToForm();
    renderSummary();
    updateChart();
    alert(bt("promptPlanSaved"));
    switchTab("overviewTab", {
        currentTarget: document.getElementById("tabOverview")
    });
}

async function addWeightRecord() {
    const date = document.getElementById("weightDate").value;
    const period = document.getElementById("weightPeriod").value;
    const weight = parseFloat(document.getElementById("weightValue").value);

    if (!date || !period || !Number.isFinite(weight)) {
        alert(bt("promptFillWeight"));
        return;
    }
    if (!currentPeriod) {
        loadSavedMeta();
    }
    if (!currentPeriod) {
        alert(bt("promptNeedPlan"));
        return;
    }

    const nextRecord = {
        itemId: "",
        periodId: currentPeriod.periodId || "",
        datetime: formatDateTime(date, period),
        weight: Number(weight.toFixed(1))
    };
    const result = await requestWeightApi("post", {
        type: "record",
        periodId: nextRecord.periodId,
        datetime: nextRecord.datetime,
        weight: nextRecord.weight
    });
    if (!result) {
        allData = sortWeightData(allData.concat(nextRecord));
        renderTable();
        renderSummary();
        updateChart();
    }

    document.getElementById("weightValue").value = "";
    if (result) {
        await reloadWeightData();
    }
    switchTab("overviewTab", {
        currentTarget: document.getElementById("tabOverview")
    });
}

async function saveEditedRecord() {
    const date = document.getElementById("editWeightDate").value;
    const period = document.getElementById("editWeightPeriod").value;
    const weight = parseFloat(document.getElementById("editWeightValue").value);

    if (!editingItemId || !date || !period || !Number.isFinite(weight)) {
        alert(bt("promptFillEdit"));
        return;
    }

    const result = await requestWeightApi("put", {
        type: "record",
        itemId: editingItemId,
        periodId: currentPeriod ? currentPeriod.periodId : "",
        datetime: formatDateTime(date, period),
        weight: Number(weight.toFixed(1))
    });
    if (!result) return;

    closeEditDialog();
    await reloadWeightData();
}

async function deleteEditedRecord() {
    if (!editingItemId) return;
    const result = await requestWeightApi("delete", {
        type: "record",
        itemId: editingItemId,
        datetime: editingDatetime
    });
    if (!result) return;
    closeEditDialog();
    await reloadWeightData();
}

function initPickers() {
    $("#periodStartDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#targetEndDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#weightDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#editWeightDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
}

function setTodayDefaults() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayText = yyyy + "-" + mm + "-" + dd;
    if (!document.getElementById("periodStartDate").value) document.getElementById("periodStartDate").value =
        todayText;
    if (!document.getElementById("weightDate").value) document.getElementById("weightDate").value = todayText;
}

function bindEvents() {
    document.getElementById("savePlanBtn").addEventListener("click", savePlan);
    document.getElementById("addWeightBtn").addEventListener("click", addWeightRecord);
    document.getElementById("saveEditBtn").addEventListener("click", saveEditedRecord);
    document.getElementById("cancelEditBtn").addEventListener("click", closeEditDialog);
    document.getElementById("deleteEditBtn").addEventListener("click", deleteEditedRecord);
    document.getElementById("loadOlderChartBtn").addEventListener("click", loadOlderWeightMonth);
    document.getElementById("loadOlderTableBtn").addEventListener("click", loadOlderWeightMonth);
    document.getElementById("loadOlderEditBtn").addEventListener("click", loadOlderWeightMonth);
    ["periodStartDate", "startWeightKg", "targetEndDate", "targetGainKg"].forEach(function (id) {
        const el = document.getElementById(id);
        el.addEventListener("change", savePlanLocallyFromForm);
        el.addEventListener("blur", savePlanLocallyFromForm);
    });
    document.getElementById("editDialog").addEventListener("click", function (event) {
        if (event.target.id === "editDialog") closeEditDialog();
    });
}


window.addEventListener("load", async function () {
    const initialSavedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const browserLang = normalizeLangToUi(navigator.language || "en-US");
    selectedUiLang = isSupportedLang(initialSavedLang) ? initialSavedLang : browserLang;
    localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
    await initI18n(selectedUiLang);
    renderLanguageOptions();
    applyI18n();
    loadSavedMeta();
    loadMetaToForm();
    renderSummary();
    initPickers();
    setTodayDefaults();
    bindEvents();
    bootWeightApp();
});
