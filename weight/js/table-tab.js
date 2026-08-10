// Tabs and table rendering for weight. Loaded as a classic script.

function switchTab(tabId, event) {
    document.querySelectorAll(".tab-panel").forEach(function (panel) {
        panel.classList.remove("active");
    });
    document.querySelectorAll(".tab-button").forEach(function (button) {
        button.classList.remove("active");
    });
    const nextPanel = document.getElementById(tabId);
    if (nextPanel) nextPanel.classList.add("active");
    if (event && event.currentTarget) event.currentTarget.classList.add("active");
    if (tabId === "overviewTab") {
        chart.resize();
        chart.update();
    } else if (tabId === "tableTab" || tabId === "editTab") {
        renderTable();
    }
}


function createTablePage() {
    renderTable();
}

function populateTable() {
    renderTable();
}

async function setallData() {
    await reloadWeightData();
}


function renderTable() {
    const meta = getMeta();
    const startWeight = Number(meta.startWeightKg);
    const records = getFilteredRecords();
    const renderRows = function (tableId, emptyId, includeEdit) {
        const body = document.querySelector(`#${tableId} tbody`);
        const empty = document.getElementById(emptyId);
        if (!body || !empty) return;
        body.innerHTML = "";

        if (!records.length) {
            empty.style.display = "block";
            return;
        }

        empty.style.display = "none";
        records.forEach(function (item) {
            const datePart = String(item.datetime).split(" ")[0];
            const timePart = String(item.datetime).split(" ")[1] || "06:00";
            const period = timePart === "12:00" ? "2" : (timePart === "18:00" ? "3" : "1");
            const gain = Number.isFinite(startWeight) ? Number(item.weight) - startWeight : null;
            const row = document.createElement("tr");
            const itemId = resolveItemId(item);
            row.innerHTML = `
                <td>${datePart}</td>
                <td>${period === "1" ? bt("morning") : period === "2" ? bt("noon") : bt("evening")}</td>
                <td class="strong-num">${Number(item.weight).toFixed(1)}</td>
                <td class="strong-num">${Number.isFinite(gain) ? (gain >= 0 ? "+" : "") + gain.toFixed(1) + " kg" : "-"}</td>
                ${includeEdit ? `<td><button type="button" class="edit-btn" data-item-id="${itemId}" data-datetime="${item.datetime}">${bt("editBtn")}</button></td>` : ""}
            `;
            body.appendChild(row);
        });

        body.querySelectorAll(".edit-btn").forEach(function (button) {
            button.addEventListener("click", function () {
                openEditDialog(this.dataset.itemId, this.dataset.datetime);
            });
        });
    };
    renderRows("tableRecordTable", "tableOnlyEmpty", false);
    renderRows("recordTable", "tableEmpty", true);
}
