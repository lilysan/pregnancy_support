// Chart canvas rendering
// Split from blood_sugar/index.html. Loaded as a classic script.

function periodKey(periodValue) {
  const map = {
    1: "beforeBreakfast",
    2: "afterBreakfast",
    3: "beforeLunch",
    4: "afterLunch",
    5: "beforeDinner",
    6: "afterDinner",
    7: "beforeSleep",
  };
  return map[Number(periodValue)] || "beforeBreakfast";
}
 function periodLabel(periodValue) {
  return bt(periodKey(periodValue));
}
 function chartPeriodLabelLines(periodValue) {
  const key = periodKey(periodValue);
  const ja = tx(key, "ja") || key;
  const tr = tx(key, selectedUiLang);
  if (!tr || selectedUiLang === "ja" || tr === ja) return [ja];
  return [ja, tr];
}
 function isPostMealPeriod(periodValue) {
  return [2, 4, 6].includes(Number(periodValue));
}
 function sugarTargetMax(periodValue) {
  return isPostMealPeriod(periodValue) ? 140 : 95;
}
 function isSugarAlert(item) {
  if (!item) return false;
  return Number(item.sugar) >= sugarTargetMax(item.period);
}
 function readMedicationStatus(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? String(checked.value || "none") : "none";
}
 function setMedicationStatus(name, value) {
  const numeric = Number(value);
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  const targetValue =
    (!Number.isNaN(numeric) && numeric > 0) ||
    normalized === "yes" ||
    normalized === "あり" ||
    normalized === "1"
      ? "yes"
      : "none";
  const target = document.querySelector(
    `input[name="${name}"][value="${targetValue}"]`,
  );
  if (target) target.checked = true;
}
 function resolveMedicineValue(item) {
  if (!item) return 0;
  const medicine = Number(item.medicine);
  if (Number.isFinite(medicine) && medicine > 0) return medicine;
  if (String(item.medicationStatus || "none") !== "yes") return 0;
  const unit = Number(String(item.medicationUnit || "").trim());
  if (Number.isFinite(unit) && unit > 0) return unit;
  return 1;
}
 function resolveItemId(item) {
  if (!item) return "";
  return (
    item.itemId ||
    item.LitemId ||
    item.Litemid ||
    item.litemId ||
    item.id ||
    ""
  );
}
 function medicationDisplayText(item) {
  const medicine = resolveMedicineValue(item);
  if (!(medicine > 0)) return "-";
  return `○ ${medicine}`;
}
 function medicationIconText(item) {
  const amount = resolveMedicineValue(item);
  if (Number.isFinite(amount) && amount > 0) {
    const safeCount = Math.floor(amount);
    if (safeCount <= 5) return "●".repeat(safeCount);
    return `●×${safeCount}`;
  }
  return "";
}
 function syncMedicationUnitVisibility() {
  const addVisible = readMedicationStatus("medicationStatus") === "yes";
  const editVisible =
    readMedicationStatus("editMedicationStatus") === "yes";
  const addWrap = document.getElementById("medicationUnitWrap");
  const editWrap = document.getElementById("editMedicationUnitWrap");
  if (addWrap) addWrap.classList.toggle("is-hidden", !addVisible);
  if (editWrap) editWrap.classList.toggle("is-hidden", !editVisible);
}
 function formatDisplayDate(dateStr) {
  const d = new Date(String(dateStr || ""));
  if (isNaN(d.getTime())) return String(dateStr || "");
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
 function formatChartDateShort(dateStr) {
  const d = new Date(String(dateStr || ""));
  if (isNaN(d.getTime())) return String(dateStr || "");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
 function updateChartRangeTitle() {
  const el = document.getElementById("chartRangeTitle");
  if (!el) return;
  const now = new Date();
  const prev = new Date();
  prev.setDate(now.getDate() - 7);
  el.textContent = `${formatChartDateShort(now)} ー ${formatChartDateShort(prev)}`;
}
 function syncOlderButtons() {
  const text = hasOlderSugar ? bt("older") : bt("noMore");
  ["loadOlderChartBtn", "loadOlderTableBtn", "loadOlderEditBtn"].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.textContent = loadingOlderSugar ? bt("loading") : text;
      btn.disabled = loadingOlderSugar || !hasOlderSugar;
    },
  );
}
 function getWeekWindow(page) {
  const to = new Date();
  to.setHours(23, 59, 59, 999);
  to.setDate(to.getDate() - 7 * (page - 1));
  const from = new Date(to);
  from.setDate(from.getDate() - 7);
  from.setHours(0, 0, 0, 0);
  return {
    from,
    to,
  };
}
 function getItemsForWeekPage(items, page) {
  const win = getWeekWindow(page);
  return (items || [])
    .filter((item) => {
      const d = new Date(item.date);
      return (
        !isNaN(d.getTime()) &&
        win.from.getTime() < d.getTime() &&
        d.getTime() <= win.to.getTime()
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA - dateB !== 0) return dateA - dateB;
      return Number(a.period || 0) - Number(b.period || 0);
    });
}
 function dedupeSugarItems(items) {
  const map = new Map();
  (items || []).forEach((item) => {
    const key = `${String(item.date || "")}-${Number(item.period || 0)}`;
    map.set(key, item);
  });
  return Array.from(map.values()).sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (da !== db) return da - db;
    return Number(a.period || 0) - Number(b.period || 0);
  });
}
 function fetchSugarPage(page, mergeMode) {
  const query = {
    unit: "date",
    limit: 7,
    page: page,
  };
  return Promise.resolve(
    loadData(token, "mySugar", query, mergeMode || "replace"),
  ).then((items) => {
    allData = dedupeSugarItems(allData);
    return items || [];
  });
}
 function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Request timed out"));
    }, ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
 function loadInitialSugarWindow() {
  return fetchSugarPage(1, "replace").then((items) => {
    allData = dedupeSugarItems(items);
    updateChart(allData);
    syncOlderButtons();
  });
}
 function reloadSugarDataAndRender() {
  sugarPage = 1;
  loadedWeekPages = 1;
  hasOlderSugar = true;
  loadingOlderSugar = false;
  syncOlderButtons();
  return loadInitialSugarWindow().then(() => {
    createTablePage();
    populateTable();
  });
}
 function loadOlderSugarData() {
  if (loadingOlderSugar || !hasOlderSugar) return;
  loadingOlderSugar = true;
  syncOlderButtons();
  const nextPage = loadedWeekPages + 1;
  const finishLoading = () => {
    loadingOlderSugar = false;
    syncOlderButtons();
  };
  withTimeout(fetchSugarPage(nextPage, "append"), 20000)
    .then((items) => {
      if (items.length > 0) {
        loadedWeekPages = nextPage;
        sugarPage = nextPage;
        allData = dedupeSugarItems(allData);
        updateChart(allData);
        createTablePage();
        populateTable();
        return;
      }
      hasOlderSugar = false;
    })
    .catch((e) => {
      console.error("load older sugar error:", e);
      alert(bt("loading") + "に失敗しました。もう一度お試しください。");
    })
    .then(finishLoading, finishLoading);
}
 function getSortedSugarData() {
  return (Array.isArray(allData) ? allData.slice() : []).sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) return dateA - dateB;
    return Number(a.period || 0) - Number(b.period || 0);
  });
}
 function buildSugarChartConfig() {
  return {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: bt("sugarLabel"),
          data: [],
          borderColor: "#e87f2f",
          backgroundColor: "rgba(232, 127, 47, 0.18)",
          fill: true,
          tension: 0.28,
          pointRadius: function (ctx) {
            const raw =
              (ctx.dataset &&
                ctx.dataset.rawItems &&
                ctx.dataset.rawItems[ctx.dataIndex]) ||
              null;
            return isSugarAlert(raw) ? 6 : 4;
          },
          pointHoverRadius: function (ctx) {
            const raw =
              (ctx.dataset &&
                ctx.dataset.rawItems &&
                ctx.dataset.rawItems[ctx.dataIndex]) ||
              null;
            return isSugarAlert(raw) ? 8 : 6;
          },
          pointBackgroundColor: function (ctx) {
            const raw =
              (ctx.dataset &&
                ctx.dataset.rawItems &&
                ctx.dataset.rawItems[ctx.dataIndex]) ||
              null;
            return isSugarAlert(raw) ? "#ff3b30" : "#ffffff";
          },
          pointBorderColor: function (ctx) {
            const raw =
              (ctx.dataset &&
                ctx.dataset.rawItems &&
                ctx.dataset.rawItems[ctx.dataIndex]) ||
              null;
            return isSugarAlert(raw) ? "#ff3b30" : "#e87f2f";
          },
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      layout: {
        padding: {
          bottom: 20,
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 10,
            color: "#22324a",
            font: {
              size: 12,
              weight: "700",
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(28, 43, 66, 0.92)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          displayColors: true,
          callbacks: {
            afterBody: function (items) {
              if (!items || !items.length) return [];
              const raw =
                items[0].dataset && items[0].dataset.rawItems
                  ? items[0].dataset.rawItems[items[0].dataIndex]
                  : null;
              if (!raw) return [];
              const target = sugarTargetMax(raw.period);
              return isPostMealPeriod(raw.period)
                ? [`目標: 食後 140mg/dL未満`, `判定基準: ${target}mg/dL`]
                : [
                    `目標: 空腹時 95mg/dL未満`,
                    `判定基準: ${target}mg/dL`,
                  ];
            },
          },
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: bt("yAxis"),
          },
          min: 40,
          max: 220,
          grid: {
            color: "rgba(132, 161, 204, 0.20)",
          },
          ticks: {
            color: "#405370",
            stepSize: 20,
          },
        },
        x: {
          title: {
            display: true,
            text: bt("xAxis"),
          },
          grid: {
            display: false,
          },
          ticks: {
            color: "#405370",
            maxRotation: 20,
            minRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8,
          },
        },
      },
    },
  };
}
 function setChartData(chart, items) {
  const labelsLocal = [];
  const sugarLocal = [];
  (items || []).forEach((item) => {
    const lines = [
      formatChartDateShort(item.date),
      ...chartPeriodLabelLines(item.period),
    ];
    const medicationIcons = medicationIconText(item);
    if (medicationIcons) lines.push(medicationIcons);
    labelsLocal.push(lines);
    sugarLocal.push(Number(item.sugar));
  });
  chart.data.labels = labelsLocal;
  chart.data.datasets[0].label = bt("sugarLabel");
  chart.data.datasets[0].data = sugarLocal;
  chart.data.datasets[0].rawItems = (items || []).slice();
  chart.options.scales.y.title.text = bt("yAxis");
  chart.options.scales.x.title.text = bt("xAxis");
  chart.update();
}
 function renderWeeklyCharts(items) {
  const page1 = getItemsForWeekPage(items, 1);
  setChartData(bloodSugarChart, page1);
  chartInstances.forEach((c) => c.destroy());
  chartInstances = [];
  const container = document.getElementById("olderChartsContainer");
  if (!container) return;
  container.innerHTML = "";
  for (let p = 2; p <= loadedWeekPages; p++) {
    const weekItems = getItemsForWeekPage(items, p);
    if (!weekItems.length) continue;
    const card = document.createElement("section");
    card.className = "older-chart-card";
    const title = document.createElement("h3");
    title.className = "older-chart-title";
    const win = getWeekWindow(p);
    const start = new Date(win.from);
    start.setDate(start.getDate() + 1);
    title.textContent = `${p - 1}週間前 (${formatChartDateShort(start)}-${formatChartDateShort(win.to)})`;
    const canvas = document.createElement("canvas");
    card.appendChild(title);
    card.appendChild(canvas);
    container.appendChild(card);
    const chart = new Chart(
      canvas.getContext("2d"),
      buildSugarChartConfig(),
    );
    setChartData(chart, weekItems);
    chartInstances.push(chart);
  }
}
 function updateChart(data) {
  const sorted = getSortedSugarData();
  allData = sorted;
  renderWeeklyCharts(sorted);
}
