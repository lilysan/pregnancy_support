// Chart and summary rendering for weight. Loaded as a classic script.

const chart = new Chart(document.getElementById("weightPeriodChart").getContext("2d"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
                label: "体重(kg)",
                data: [],
                borderColor: "#4f8f96",
                backgroundColor: "rgba(79, 143, 150, 0.16)",
                borderWidth: 3,
                pointRadius: 4,
                pointHoverRadius: 5,
                fill: false,
                tension: 0.22
            },
            {
                label: "目標ライン",
                data: [],
                borderColor: "#e9778d",
                borderWidth: 2,
                pointRadius: 0,
                borderDash: [6, 6],
                fill: false,
                tension: 0
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    boxWidth: 14,
                    color: "#2c3e50",
                    font: {
                        size: 12,
                        weight: "700"
                    }
                }
            }
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    displayFormats: {
                        day: "M/d"
                    }
                },
                ticks: {
                    color: "#647381"
                },
                grid: {
                    color: "rgba(79, 143, 150, 0.10)"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "体重(kg)"
                },
                ticks: {
                    color: "#647381"
                },
                grid: {
                    color: "rgba(79, 143, 150, 0.10)"
                }
            }
        }
    }
});


function getFilteredRecords() {
    const meta = getMeta();
    const start = meta.startDate ? parseDateOnly(meta.startDate).getTime() : null;
    const end = meta.endDate ? parseDateOnly(meta.endDate).getTime() : null;

    return sortWeightData(allData).filter(function (item) {
        if (!Number.isFinite(start) || !Number.isFinite(end)) return true;
        const datePart = String(item.datetime || "").split(" ")[0];
        const time = parseDateOnly(datePart).getTime();
        return start <= time && time <= end;
    });
}


function updateChart() {
    const meta = getMeta();
    const records = getFilteredRecords();
    const goalPoints = [];

    if (meta.startDate && meta.endDate && Number.isFinite(meta.startWeightKg) && Number.isFinite(meta
            .targetGainKg)) {
        goalPoints.push({
            x: new Date(meta.startDate + "T00:00:00"),
            y: meta.startWeightKg
        });
        goalPoints.push({
            x: new Date(meta.endDate + "T00:00:00"),
            y: meta.startWeightKg + meta.targetGainKg
        });
    }

    chart.data.datasets[0].data = records.map(function (item) {
        return {
            x: new Date(item.datetime),
            y: Number(item.weight)
        };
    });
    chart.data.datasets[1].data = goalPoints;
    chart.update();
    renderSummary();
}

function renderSummary() {
    const meta = getMeta();
    const records = getFilteredRecords();
    const latest = records.length ? records[records.length - 1] : null;
    const startWeight = Number(meta.startWeightKg);
    const targetGain = Number(meta.targetGainKg);
    const targetWeight = Number.isFinite(startWeight) && Number.isFinite(targetGain) ? startWeight +
        targetGain : null;
    const currentWeight = latest ? Number(latest.weight) : null;
    const currentGain = Number.isFinite(currentWeight) && Number.isFinite(startWeight) ? currentWeight -
        startWeight : null;
    const remaining = Number.isFinite(targetWeight) && Number.isFinite(currentWeight) ? targetWeight -
        currentWeight : null;

    document.getElementById("summaryPeriod").textContent = meta.startDate && meta.endDate ? meta.startDate +
        " - " + meta.endDate : "-";
    document.getElementById("summaryStartWeight").textContent = formatWeight(startWeight);
    document.getElementById("summaryLatestWeight").textContent = formatWeight(currentWeight);
    document.getElementById("summaryCurrentGain").textContent = Number.isFinite(currentGain) ? currentGain
        .toFixed(1) + " kg" : "-";
    document.getElementById("summaryTargetWeight").textContent = formatWeight(targetWeight);
    document.getElementById("summaryRemaining").textContent = Number.isFinite(remaining) ? remaining.toFixed(
        1) + " kg" : "-";

    const progressFill = document.getElementById("gainProgressFill");
    const progressText = document.getElementById("gainProgressText");
    const statusNote = document.getElementById("statusNote");
    const allowanceGained = document.getElementById("allowanceGained");
    const allowanceRemaining = document.getElementById("allowanceRemaining");
    const allowanceOver = document.getElementById("allowanceOver");
    const allowanceGainedText = document.getElementById("allowanceGainedText");
    const allowanceRemainingText = document.getElementById("allowanceRemainingText");
    const setAllowance = function (gainValue, targetValue) {
        if (!Number.isFinite(targetValue) || targetValue <= 0) {
            allowanceGained.style.width = "0%";
            allowanceRemaining.style.width = "0%";
            allowanceOver.style.width = "0%";
            allowanceGainedText.textContent = btTemplate("allowanceGained", {
                value: "-"
            });
            allowanceRemainingText.textContent = btTemplate("allowanceRemaining", {
                value: "-"
            });
            return;
        }
        const safeGain = Number.isFinite(gainValue) ? gainValue : 0;
        const safeTarget = targetValue;
        const gainedWithinGoal = Math.max(0, Math.min(safeGain, safeTarget));
        const remainingValue = Math.max(0, safeTarget - Math.max(0, safeGain));
        const overValue = Math.max(0, safeGain - safeTarget);
        const total = Math.max(safeTarget + overValue, 1);
        allowanceGained.style.width = (gainedWithinGoal / total) * 100 + "%";
        allowanceRemaining.style.width = (remainingValue / total) * 100 + "%";
        allowanceOver.style.width = (overValue / total) * 100 + "%";
        allowanceGainedText.textContent = btTemplate("allowanceGained", {
            value: formatSignedKg(safeGain)
        });
        allowanceRemainingText.textContent = btTemplate("allowanceRemaining", {
            value: formatWeight(remainingValue)
        });
    };

    if (!meta.startDate || !meta.endDate || !Number.isFinite(startWeight) || !Number.isFinite(targetGain)) {
        progressFill.style.width = "0%";
        progressText.textContent = bt("progressNoPlan");
        setAllowance(null, null);
        statusNote.className = "status-note neutral";
        statusNote.textContent = bt("statusNeedPlan");
        return;
    }

    if (!records.length) {
        progressFill.style.width = "0%";
        progressText.textContent = bt("progressNoRecords");
        setAllowance(0, targetGain);
        statusNote.className = "status-note neutral";
        statusNote.textContent = bt("statusNoRecords");
        return;
    }

    const pct = targetGain <= 0 ? 0 : Math.max(0, Math.min(100, (currentGain / targetGain) * 100));
    progressFill.style.width = pct + "%";
    progressText.textContent = btTemplate("progressCurrentAndGoal", {
        current: currentGain.toFixed(1),
        target: targetGain.toFixed(1)
    });
    setAllowance(currentGain, targetGain);

    if (currentGain < 0) {
        statusNote.className = "status-note warn";
        statusNote.textContent = bt("statusLosing");
    } else if (currentGain <= targetGain * 0.8) {
        statusNote.className = "status-note ok";
        statusNote.textContent = bt("statusOk");
    } else if (currentGain <= targetGain) {
        statusNote.className = "status-note warn";
        statusNote.textContent = bt("statusNearGoal");
    } else {
        statusNote.className = "status-note alert";
        statusNote.textContent = bt("statusOverGoal");
    }
}
