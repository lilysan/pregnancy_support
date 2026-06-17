// LIFF and API communication
// Split from blood_pressure/index.html. Loaded as a classic script.

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

const getAccessObj = (data) => {
  const requestData = Object.assign({}, data);
  const effectiveUserId = state.userId || window.userId || "";
  requestData.userId = effectiveUserId;
  if (requestData.postData && typeof requestData.postData === "object") {
    requestData.postData = Object.assign({}, requestData.postData, {
      userId: effectiveUserId
    });
  }
  requestData.lang = window.normalizedLanguageCode || state.appLanguage || "";
  console.log("blood_pressure request payload:", requestData);
  return {
    url: API_URL,
    type: "POST",
    dataType: "json",
    data: JSON.stringify(requestData),
    timeout: 30000,
  };
};

function toPressureApiPostData(method, data) {
  const value = data || {};
  if (method === "get") {
    return {
      unit: value.unit || value.Lunit || "date",
      limit: Number(value.limit || value.Llimit || 1),
      page: Number(value.page || value.Lpage || 1),
    };
  }
  if (method === "delete") {
    return {
      date: value.date || value.Ldate || "",
      period: Number(value.period || value.Lperiod || 0),
    };
  }
  const mapped = {
    date: value.date || value.Ldate || "",
    period: Number(value.period || value.Lperiod || 0),
    high: Number(value.high || value.Lhigh || 0),
    low: Number(value.low || value.Llow || 0),
    medicine: hasMedicineFlag(value.medicine ?? value.Lmedicine) ? 1 : 0,
  };
  if (method === "put") {
    mapped.itemId = value.itemId || value.LitemId || "";
  }
  return mapped;
}

function pressurePayload(method, data) {
  return toPressureApiPostData(method, data);
}

function pressureApiPath(type) {
  return type === "pressure" || type === "myPressure" ? "myPressure" : type;
}

function normalizePressureItem(item) {
  if (!item) return null;
  return {
    itemId: item.LitemId || item.itemId || item.id || "",
    date: item.Ldate || item.date || "",
    period: Number(item.Lperiod || item.period || 0),
    high: Number(item.Lhigh || item.high || 0),
    low: Number(item.Llow || item.low || 0),
    medicine: item.Lmedicine ?? item.medicine ?? 0,
  };
}

function extractPressureItems(response) {
  const data = response && response.data ? response.data : {};
  const rawItems = data.Litems || data.items || [];
  return Array.isArray(rawItems)
    ? rawItems.map(normalizePressureItem).filter(Boolean)
    : [];
}

function decodeIdTokenUserId(idToken) {
  try {
    const payload = String(idToken || "").split(".")[1];
    if (!payload) return "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = JSON.parse(decodeURIComponent(escape(atob(padded))));
    return decoded.sub || decoded.userId || "";
  } catch (error) {
    console.warn("Failed to decode LIFF ID token:", error);
    return "";
  }
}

function loadData(idToken, type, postData, mergeMode) {
  showAppLoader();
  const method = "get";
  const safePostData =
    type === "myPressure"
      ? pressurePayload(method, postData)
      : postData || {};
  const safeMergeMode = mergeMode || "replace";
  if (window.IS_TEST_MODE && type === "myPressure") {
    const page = Number(safePostData.page || 1);
    const limit = Math.max(1, Number(safePostData.limit || 7));
    const start = (page - 1) * limit;
    const items = MOCK_PRESSURE_ITEMS.slice(start, start + limit);
    if (safeMergeMode === "append") {
      allData = (Array.isArray(allData) ? allData : []).concat(items);
    } else {
      allData = items;
    }
    updateChart(allData);
    hideAppLoader();
    return Promise.resolve(items);
  }
  return $.ajax(
    getAccessObj({
      path: pressureApiPath(type),
      method: method,
      idToken: idToken,
      postData: safePostData,
    }),
  )
    .then(
      function (response) {
        if (response.statusCode === 401) {
          liff.logout();
          window.location.reload();
          return [];
        } else if (response.statusCode !== 200) {
          console.error(response.message);
          alert(response.message);
          return [];
        } else {
          const items =
            type === "myPressure"
              ? extractPressureItems(response)
              : response.data && Array.isArray(response.data.items)
                ? response.data.items
                : [];
          if (safeMergeMode === "append") {
            allData = (Array.isArray(allData) ? allData : []).concat(
              items,
            );
          } else {
            allData = items;
          }
          updateChart(allData);
          return items;
        }
      },
      function () {
        alert("Network error!");
        return [];
      },
    )
    .always(function () {
      hideAppLoader();
    });
}

function addData(data, type) {
  showAppLoader();
  const method = "post";
  if (window.IS_TEST_MODE && type === "myPressure") {
    MOCK_PRESSURE_ITEMS.unshift(
      Object.assign(
        {
          itemId: `mock-${Date.now()}`,
        },
        normalizePressureItem(data),
      ),
    );
    hideAppLoader();
    return Promise.resolve({
      statusCode: 200,
      data: {
        itemId: MOCK_PRESSURE_ITEMS[0].itemId,
      },
    });
  }
  return $.ajax(
    getAccessObj({
      path: pressureApiPath(type),
      method: method,
      idToken: state.idToken,
      postData:
        type === "myPressure" ? pressurePayload(method, data) : data,
    }),
  )
    .then(function (response) {
      if (response.statusCode === 401) {
        liff.logout();
        window.location.reload();
        return null;
      } else if (response.statusCode !== 200) {
        console.error(response.message);
        alert(response.message);
        return Promise.reject(new Error(response.message || "API error"));
      }
      return response.data || {};
    }, function () {
      alert("Network error!");
      return Promise.reject(new Error("Network error"));
    })
    .always(function () {
      hideAppLoader();
    });
}

function setPressure(data) {
  return addData(data, "myPressure");
}

function putData(data, type) {
  showAppLoader();
  const method = "put";
  if (window.IS_TEST_MODE && type === "myPressure") {
    const normalized = normalizePressureItem(data);
    const idx = MOCK_PRESSURE_ITEMS.findIndex(
      (item) =>
        (normalized.itemId && item.itemId === normalized.itemId) ||
        (item.date === normalized.date &&
          Number(item.period) === Number(normalized.period)),
    );
    if (idx >= 0) {
      MOCK_PRESSURE_ITEMS[idx] = Object.assign(
        {},
        MOCK_PRESSURE_ITEMS[idx],
        normalized,
      );
    }
    hideAppLoader();
    return Promise.resolve({
      statusCode: 200,
      data: 0,
    });
  }
  return $.ajax(
    getAccessObj({
      path: pressureApiPath(type),
      method: method,
      idToken: state.idToken,
      postData:
        type === "myPressure" ? pressurePayload(method, data) : data,
    }),
  )
    .then(function (response) {
      if (response.statusCode === 401) {
        liff.logout();
        window.location.reload();
        return null;
      } else if (response.statusCode !== 200) {
        console.error(response.message);
        alert(response.message);
        return Promise.reject(new Error(response.message || "API error"));
      }
      return response.data || {};
    }, function () {
      alert("Network error!");
      return Promise.reject(new Error("Network error"));
    })
    .always(function () {
      hideAppLoader();
    });
}

function deleteData(data, type) {
  showAppLoader();
  const method = "delete";
  if (window.IS_TEST_MODE && type === "myPressure") {
    const payload = pressurePayload(method, data);
    const idx = MOCK_PRESSURE_ITEMS.findIndex(
      (item) =>
        item.date === payload.date &&
        Number(item.period) === Number(payload.period),
    );
    if (idx >= 0) {
      MOCK_PRESSURE_ITEMS.splice(idx, 1);
    }
    hideAppLoader();
    return Promise.resolve({
      statusCode: 200,
      data: 0,
    });
  }
  return $.ajax(
    getAccessObj({
      path: pressureApiPath(type),
      method: method,
      idToken: state.idToken,
      postData:
        type === "myPressure" ? pressurePayload(method, data) : data,
    }),
  )
    .then(function (response) {
      if (response.statusCode === 401) {
        liff.logout();
        window.location.reload();
        return null;
      } else if (response.statusCode !== 200) {
        console.error(response.message);
        alert(response.message);
        return Promise.reject(new Error(response.message || "API error"));
      }
      setallData();
      return response.data || {};
    }, function () {
      alert("Network error!");
      return Promise.reject(new Error("Network error"));
    })
    .always(function () {
      hideAppLoader();
    });
}

function startPressureApp(idToken) {
  token = idToken;
  pressurePage = 1;
  loadedWeekPages = 1;
  hasOlderPressure = true;
  loadingOlderPressure = false;
  syncOlderButtons();
  return loadInitialPressureWindow()
    .then(() => {
      createTablePage();
      populateTable();
    })
    .catch((e) => {
      console.error("initial load error:", e);
    });
}

function loadInitialPressureWindow() {
  return fetchPressurePage(1, "replace").then((items) => {
    if (items.length > 0) {
      allData = dedupePressureItems(items);
      updateChart(allData);
      return;
    }
    allData = [];
    updateChart(allData);
    syncOlderButtons();
  });
}

function reloadPressureDataAndRender() {
  pressurePage = 1;
  loadedWeekPages = 1;
  hasOlderPressure = true;
  loadingOlderPressure = false;
  return loadInitialPressureWindow().then(() => {
    createTablePage();
    populateTable();
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
    $("#header-container").load(
      "../common/header.html",
      function (_responseText, status) {
        if (status === "error") {
          clearTimeout(timer);
          fail(new Error("Failed to load header.html"));
          return;
        }
        document.addEventListener(
          "i18n-initialized",
          function () {
            clearTimeout(timer);
            finish();
          },
          {
            once: true,
          },
        );
        $.getScript("../common/js/header.js").fail(function () {
          clearTimeout(timer);
          fail(new Error("Failed to load header.js"));
        });
      },
    );
  });
}

const liff = window.liff;

const state = {
    idToken: null,
    appLanguage: "",
    userId:null
};

function bootPressureApp() {
  showAppLoader();
  const isDev =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  liff
    .init({
      liffId: LIFF_ID,
      withLoginOnExternalBrowser: !isDev,
    })
    .then(() => {
      state.idToken = liff.getIDToken();
      state.appLanguage =
        typeof liff.getAppLanguage === "function" ? liff.getAppLanguage() : "";
      return Promise.resolve(
        typeof liff.getProfile === "function" ? liff.getProfile() : null,
      )
        .catch(() => null)
        .then((profile) => {
          const decoded =
            typeof liff.getDecodedIDToken === "function"
              ? liff.getDecodedIDToken()
              : null;
          state.userId =
            profile && profile.userId
              ? profile.userId
              : (decoded && (decoded.sub || decoded.userId)) ||
                decodeIdTokenUserId(state.idToken) ||
              "";
          console.log(state.userId)
          window.userId = state.userId;
          console.log(window.userId)
          console.log("blood_pressure resolved userId:", state.userId);
          return Promise.all([startPressureApp(state.idToken), loadHeader()]);
        });
    })
    .then(() => {
      hideAppLoader();
    })
    .catch((error) => {
      console.error("LIFF init failed:", error);
      hideAppLoader();
      alert("LIFF init failed.");
    });
}
