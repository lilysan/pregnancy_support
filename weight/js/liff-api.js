// LIFF and API communication for weight. Loaded as a classic script.

function showAppLoader() {
    const loader = document.querySelector(".loader");
    if (!loader) return;
    loader.classList.remove("is-hidden");
    loader.style.display = "grid";
    loader.setAttribute("aria-hidden", "false");
}

function hideAppLoader() {
    const loader = document.querySelector(".loader");
    if (!loader) return;
    loader.classList.add("is-hidden");
    loader.style.display = "none";
    loader.setAttribute("aria-hidden", "true");
}

function getAccessObj(data) {
    const requestData = Object.assign({}, data);
    if (requestData.userId && requestData.postData && typeof requestData.postData === "object") {
        requestData.postData = Object.assign({}, requestData.postData, {
            userId: requestData.userId
        });
    }
    requestData.lang = window.normalizedLanguageCode || "";
    return {
        url: API_URL,
        type: "POST",
        dataType: "json",
        data: JSON.stringify(requestData),
        timeout: 30000
    };
}

function showLoader() {
    if (typeof showAppLoader === "function") {
        showAppLoader();
        return;
    }
    $(".loader").removeClass("is-hidden").css("display", "grid").attr("aria-hidden", "false");
}

function hideLoader() {
    if (typeof hideAppLoader === "function") {
        hideAppLoader();
        return;
    }
    $(".loader").addClass("is-hidden").css("display", "none").attr("aria-hidden", "true");
}

function weightPayload(method, data) {
    const value = data || {};
    if (method === "get") {
        return {
            unit: value.unit || value.Lunit || "month",
            limit: Number(value.limit || value.Llimit || 1),
            page: Number(value.page || value.Lpage || 1)
        };
    }
    if (method === "delete") {
        return {
            datetime: value.datetime || value.Ldatetime || ""
        };
    }
    const mapped = {
        datetime: value.datetime || value.Ldatetime || "",
        weight: Number(value.weight != null ? value.weight : (value.Lweight != null ? value.Lweight : 0))
    };
    if (method === "put") {
        mapped.itemId = value.itemId || value.LitemId || value.id || "";
    }
    return mapped;
}

function requestWeightApi(method, postData) {
    showLoader();
    const safePostData = weightPayload(method, postData);
    const access = getAccessObj({
        path: "myWeight",
        method: method,
        idToken: token,
        userId: userId,
        postData: safePostData
    });
    access.timeout = 12000;
    return $.ajax(access).then(function (response) {
        if (response.statusCode === 401) {
            liff.logout();
            window.location.reload();
            return null;
        }
        if (response.statusCode !== 200) {
            console.error(response.message);
            alert(response.message || "API error");
            return null;
        }
        return response.data || {};
    }, function () {
        alert(bt("networkError"));
        return null;
    }).always(function () {
        hideLoader();
    });
}

function resolveItemId(item) {
    if (!item) return "";
    return item.itemId || item.LitemId || item.Litemid || item.litemId || item.id || "";
}

function normalizePeriod(period) {
    if (!period) return null;
    return {
        periodId: period.periodId || period.LperiodId || period.id || "",
        startDate: period.startDate || period.LstartDate || "",
        startWeightKg: Number(period.startWeightKg != null ? period.startWeightKg : period.LstartWeightKg),
        endDate: period.endDate || period.targetEndDate || period.LendDate || "",
        targetGainKg: Number(period.targetGainKg != null ? period.targetGainKg : period.LtargetGainKg)
    };
}

function normalizeWeightItem(item) {
    return {
        itemId: resolveItemId(item),
        periodId: item.periodId || item.LperiodId || "",
        datetime: item.datetime || item.Ldatetime || "",
        weight: Number(item.weight != null ? item.weight : item.Lweight)
    };
}

function syncPeriodNav() {
    ["loadOlderChartBtn", "loadOlderTableBtn", "loadOlderEditBtn"].forEach(function (id) {
        const olderBtn = document.getElementById(id);
        if (!olderBtn) return;
        olderBtn.textContent = loadingWeightMonth ? bt("loading") : (hasOlderWeightMonth ? bt("loadOlderMonth") : bt("noMore"));
        olderBtn.disabled = loadingWeightMonth || !hasOlderWeightMonth;
    });
}

function applyWeightMonthPayload(payload, page, mode) {
    const data = payload || {};
    if (!currentPeriod) {
        loadSavedMeta();
    }
    const items = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
    const normalizedItems = items.map(normalizeWeightItem).filter(function (item) {
        return item.datetime && Number.isFinite(item.weight);
    });
    if (mode === "append") {
        const map = new Map();
        allData.concat(normalizedItems).forEach(function (item) {
            map.set(String(item.itemId || item.datetime), item);
        });
        allData = sortWeightData(Array.from(map.values()));
    } else {
        allData = sortWeightData(normalizedItems);
    }
    weightMonthPage = page;
    hasOlderWeightMonth = data.hasOlder !== false && normalizedItems.length > 0;
    renderTable();
    renderSummary();
    updateChart();
    syncPeriodNav();
}

function fetchWeightMonthPage(page, mode) {
    loadingWeightMonth = true;
    syncPeriodNav();
    return requestWeightApi("get", {
        unit: "month",
        limit: 1,
        page: page
    }).then(function (payload) {
        if (!payload) {
            hasOlderWeightMonth = false;
            loadSavedMeta();
            renderTable();
            renderSummary();
            updateChart();
            return;
        }
        applyWeightMonthPayload(payload, page, mode || "replace");
    }).catch(function (error) {
        console.error("weight month load error:", error);
        alert(bt("loadError"));
    }).then(function () {
        loadingWeightMonth = false;
        syncPeriodNav();
    }, function () {
        loadingWeightMonth = false;
        syncPeriodNav();
    });
}

function loadOlderWeightMonth() {
    if (loadingWeightMonth || !hasOlderWeightMonth) return;
    fetchWeightMonthPage(weightMonthPage + 1, "append");
}


async function reloadWeightData() {
    await fetchWeightMonthPage(weightMonthPage || 1, "replace");
}


function startWeightApp(idToken) {
    token = idToken;
    return reloadWeightData().catch(function (error) {
        console.error("initial weight load error:", error);
    });
}

function loadHeader() {
    return new Promise((resolve, reject) => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        const fail = (error) => {
            if (settled) return;
            settled = true;
            reject(error);
        };
        const timer = setTimeout(finish, 3000);
        $("#header-container").load("../common/header.html", function (_responseText, status) {
            if (status === "error") {
                clearTimeout(timer);
                fail(new Error("Failed to load header.html"));
                return;
            }
            document.addEventListener("i18n-initialized", function () {
                clearTimeout(timer);
                finish();
            }, {
                once: true
            });
            $.getScript("../common/js/header.js").fail(function () {
                clearTimeout(timer);
                fail(new Error("Failed to load header.js"));
            });
        });
    });
}

function bootWeightApp() {
    if (typeof showAppLoader === "function") {
        showAppLoader();
    }
    const loaderFallbackTimer = setTimeout(function () {
        if (typeof hideAppLoader === "function") {
            hideAppLoader();
        }
    }, 8000);
    const finishBootLoader = function () {
        clearTimeout(loaderFallbackTimer);
        if (typeof hideAppLoader === "function") {
            hideAppLoader();
        }
    };
    const isDev = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    liff.init({
        liffId: LIFF_ID,
        withLoginOnExternalBrowser: !isDev
    }).then(() => {
        const idToken = liff.getIDToken();
        const lang = typeof liff.getAppLanguage === "function" ? liff.getAppLanguage() : "en";
        if (!isSupportedLang(localStorage.getItem(LANG_STORAGE_KEY))) {
            selectedUiLang = normalizeLangToUi(lang);
            localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
        }
        return Promise.resolve(typeof liff.getProfile === "function" ? liff.getProfile() : null)
            .catch(() => null)
            .then((profile) => {
                const decoded = typeof liff.getDecodedIDToken === "function" ? liff.getDecodedIDToken() : null;
                userId = profile && profile.userId ? profile.userId : ((decoded && (decoded.sub || decoded.userId)) || "");
                return Promise.all([
                    startWeightApp(idToken),
                    loadHeader()
                ]);
            });
    }).then(() => {
        finishBootLoader();
    }).catch((err) => {
        console.error("LIFF init failed:", err);
        finishBootLoader();
        alert(bt("liffInitFailed"));
    });
}
