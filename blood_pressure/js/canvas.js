// Chart canvas rendering
// Split from blood_pressure/index.html. Loaded as a classic script.

function updateChart(data) {
  const sorted = (Array.isArray(data) ? data.slice() : []).sort(
    (a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (dateA - dateB !== 0) {
        return dateA - dateB;
      }
      return Number(a.period || 0) - Number(b.period || 0);
    },
  );
  allData = sorted;
  renderWeeklyCharts(sorted);
}

const ctx = document
  .getElementById("bloodPressureChart")
  .getContext("2d");
//ctx.height = 350;
const isHighAlertValue = (v) => Number(v) >= 140;
const isLowAlertValue = (v) => Number(v) <= 70;
const chartY = (ctx) => {
  if (!ctx || !ctx.parsed) return NaN;
  return Number(ctx.parsed.y);
};

// カスタムプラグインを定義（特定のy座標範囲の背景色を塗る）
const rangeBackgroundPlugin = {
  id: "rangeBackground",
  beforeDraw: function (chart) {
    if (!showGuideOverlay) return;
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const yAxis = chart.scales.y;

    ctx.save();

    // 140以上の背景を赤色に塗る
    const topY = yAxis.getPixelForValue(140); // Y=140のピクセル位置を取得
    ctx.fillStyle = "rgba(255, 99, 132, 0.10)"; // 赤色
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.right - chartArea.left,
      topY - chartArea.top,
    );

    // 70未満の背景を青色に塗る
    const bottomY = yAxis.getPixelForValue(70); // Y=70のピクセル位置を取得
    ctx.fillStyle = "rgba(54, 162, 235, 0.10)"; // 青色
    ctx.fillRect(
      chartArea.left,
      bottomY,
      chartArea.right - chartArea.left,
      chartArea.bottom - bottomY,
    );

    ctx.restore();
  },
};

function buildPressureChartConfig() {
  return {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: bt("systolic"),
          data: [],
          borderColor: "#e5546f",
          backgroundColor: "rgba(229, 84, 111, 0.20)",
          fill: true,
          tension: 0.28,
          pointRadius: (ctx) => (isHighAlertValue(chartY(ctx)) ? 6 : 3.5),
          pointHoverRadius: (ctx) =>
            isHighAlertValue(chartY(ctx)) ? 8 : 6,
          pointBackgroundColor: (ctx) =>
            isHighAlertValue(chartY(ctx)) ? "#ff2d55" : "#ffffff",
          pointBorderColor: (ctx) =>
            isHighAlertValue(chartY(ctx)) ? "#ff2d55" : "#e5546f",
          pointBorderWidth: 2,
        },
        {
          label: bt("diastolic"),
          data: [],
          borderColor: "#3f8ee8",
          backgroundColor: "rgba(63, 142, 232, 0.20)",
          fill: true,
          tension: 0.28,
          pointRadius: (ctx) => (isLowAlertValue(chartY(ctx)) ? 6 : 3.5),
          pointHoverRadius: (ctx) =>
            isLowAlertValue(chartY(ctx)) ? 8 : 6,
          pointBackgroundColor: (ctx) =>
            isLowAlertValue(chartY(ctx)) ? "#2f80ff" : "#ffffff",
          pointBorderColor: (ctx) =>
            isLowAlertValue(chartY(ctx)) ? "#2f80ff" : "#3f8ee8",
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
      // --- ここから追加 ---
      layout: {
        padding: {
          bottom: 20, // 下側に20pxの余白を強制的に作る
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
            generateLabels: function (chart) {
              const originalLabels =
                Chart.defaults.plugins.legend.labels.generateLabels(
                  chart,
                );
              originalLabels.forEach((label) => {
                // 中の色（fillStyle）を「白」に固定
                label.fillStyle = "#ffffff";
                // 枠線の色（strokeStyle）を各データセットの色（赤/青）に合わせる
                const dataset = chart.data.datasets[label.datasetIndex];
                label.strokeStyle = dataset.borderColor;
                // 枠線の太さを少し出すと見やすいです
                label.lineWidth = 2;
              });
              return originalLabels;
            },
          },
        },
        tooltip: {
          backgroundColor: "rgba(28, 43, 66, 0.92)",
          titleColor: "#fff",
          bodyColor: "#fff",
          padding: 10,
          displayColors: true,
        },
      },
      scales: {
        y: {
          title: {
            display: true,
            text: bt("yAxis"),
          },
          min: 50,
          max: 200,
          grid: {
            color: "rgba(132, 161, 204, 0.20)",
          },
          ticks: {
            color: "#405370",
            stepSize: 10,
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
    plugins: [rangeBackgroundPlugin],
  };
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

function setChartData(chart, items) {
  const labelsLocal = [];
  const highLocal = [];
  const lowLocal = [];
  (items || []).forEach((item) => {
    const lines = [
      formatChartDateShort(item.date),
      ...chartPeriodLabelLines(item.period),
    ];
    if (hasMedicineFlag(item.medicine)) {
      lines.push("💊");
    }
    labelsLocal.push(lines);
    highLocal.push(Number(item.high));
    lowLocal.push(Number(item.low));
  });
  chart.data.labels = labelsLocal;
  chart.data.datasets[0].label = bt("systolic");
  chart.data.datasets[1].label = bt("diastolic");
  chart.data.datasets[0].data = highLocal;
  chart.data.datasets[1].data = lowLocal;
  chart.options.scales.y.title.text = bt("yAxis");
  chart.options.scales.x.title.text = bt("xAxis");
  chart.update();
}

function renderWeeklyCharts(items) {
  const page1 = getItemsForWeekPage(items, 1);
  setChartData(bloodPressureChart, page1);

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
    //canvas.height = 350;
    card.appendChild(title);
    card.appendChild(canvas);
    container.appendChild(card);

    const c = new Chart(
      canvas.getContext("2d"),
      buildPressureChartConfig(),
    );
    setChartData(c, weekItems);
    chartInstances.push(c);
  }
}

// Chart.jsの設定
let bloodPressureChart = new Chart(ctx, buildPressureChartConfig());
