// LIFF and API communication
// Split from blood_sugar/index.html. Loaded as a classic script.

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
  console.log("blood_sugar request payload:", requestData);
  return {
    url: API_URL_V2,
    type: "POST",
    dataType: "json",
    data: JSON.stringify(requestData),
    timeout: 30000,
    contentType: "application/json; charset=utf-8"
  };
}

function sugarApiPath(type) {
  return type === "sugar" || type === "mySugar" ? "mySugar" : type;
}

function sugarPayload(method, data) {
  const value = data || {};
  if (method === "get") {
    return {
      unit: value.unit || value.Lunit || "date",
      limit: Number(value.limit || value.Llimit || 1),
      page: Number(value.page || value.Lpage || 1)
    };
  }
  if (method === "delete") {
    return {
      date: value.date || value.Ldate || "",
      period: Number(value.period || value.Lperiod || 0)
    };
  }
  const mapped = {
    date: value.date || value.Ldate || "",
    period: Number(value.period || value.Lperiod || 0),
    sugar: Number(value.sugar || value.Lsugar || 0),
    medicine: Number(value.medicine ?? value.Lmedicine ?? 0)
  };
  if (method === "put") {
    mapped.itemId = value.itemId || value.LitemId || value.id || "";
  }
  return mapped;
}

function normalizeSugarItem(item) {
  if (!item) return null;
  return {
    itemId: item.itemId || item.LitemId || item.Litemid || item.litemId || item.id || "",
    date: item.date || item.Ldate || "",
    period: Number(item.period || item.Lperiod || 0),
    sugar: Number(item.sugar || item.Lsugar || 0),
    medicine: item.medicine ?? item.Lmedicine ?? 0
  };
}

function extractSugarItems(response) {
  const data = response && response.data ? response.data : {};
  const rawItems = data.items || data.Litems || [];
  return Array.isArray(rawItems) ? rawItems.map(normalizeSugarItem).filter(Boolean) : [];
}

function loadData(idToken, type, postData, mergeMode) {
  showAppLoader();
  const method = "get";
  const safePostData = type === "mySugar" ? sugarPayload(method, postData) : (postData || {});
  const safeMergeMode = mergeMode || "replace";
  return $.ajax(getAccessObj({
    path: sugarApiPath(type),
    method: method,
    idToken: idToken,
    postData: safePostData
  })).then(function (response) {
    if (response.statusCode === 401) {
      liff.logout();
      window.location.reload();
      return [];
    }
    if (response.statusCode !== 200) {
      console.error(response.message);
      alert(response.message);
      return [];
    }
    const items = type === "mySugar" ? extractSugarItems(response) : ((response.data && Array.isArray(response.data.items)) ? response.data.items : []);
    if (safeMergeMode === "append") {
      allData = (Array.isArray(allData) ? allData : []).concat(items);
    } else {
      allData = items;
    }
    updateChart(allData);
    return items;
  }, function () {
    alert("Network error!loadData");
    return [];
  }).always(function () {
    hideAppLoader();
  });
}

function addData(data, type) {
  showAppLoader();
  const method = "post";
  return $.ajax(getAccessObj({
    path: sugarApiPath(type),
    method: method,
    idToken: token,
    postData: type === "mySugar" ? sugarPayload(method, data) : data
  })).then(function (response) {
    if (response.statusCode === 401) {
      liff.logout();
      window.location.reload();
      return null;
    }
    if (response.statusCode !== 200) {
      console.error(response.message);
      alert(response.message);
      return Promise.reject(new Error(response.message || "API error"));
    }
    allData.push(data);
    populateTable();
    updateChart(allData);
    createTablePage();
    return response.data || {};
  }, function () {
    alert("Network error!addData");
    return Promise.reject(new Error("Network error!addData"));
  }).always(function () {
    hideAppLoader();
  });
}

function setSugar(data) {
  return addData(data, "mySugar");
}

function putData(data, type) {
  showAppLoader();
  const method = "put";
  return $.ajax(getAccessObj({
    path: sugarApiPath(type),
    method: method,
    idToken: token,
    postData: type === "mySugar" ? sugarPayload(method, data) : data
  })).then(function (response) {
    if (response.statusCode === 401) {
      liff.logout();
      window.location.reload();
      return null;
    }
    if (response.statusCode !== 200) {
      console.error(response.message);
      alert(response.message);
      return Promise.reject(new Error(response.message || "API error"));
    }
    return response.data || {};
  }, function () {
    alert("Network error!putData");
    return Promise.reject(new Error("Network error!putData"));
  }).always(function () {
    hideAppLoader();
  });
}

function deleteData(data, type) {
  showAppLoader();
  const method = "delete";
  return $.ajax(getAccessObj({
    path: sugarApiPath(type),
    method: method,
    idToken: token,
    postData: type === "mySugar" ? sugarPayload(method, data) : data
  })).then(function (response) {
    if (response.statusCode === 401) {
      liff.logout();
      window.location.reload();
      return null;
    }
    if (response.statusCode !== 200) {
      console.error(response.message);
      alert(response.message);
      return Promise.reject(new Error(response.message || "API error"));
    }
    setallData();
    return response.data || {};
  }, function () {
    alert("Network error!deleteData");
    return Promise.reject(new Error("Network error!deleteData"));
  }).always(function () {
    hideAppLoader();
  });
}

const sugarState = {
  idToken: "",
  appLanguage: ""
};


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
      function (responseText, status) {
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

function startSugarApp(idToken) {
  token = idToken;
  sugarPage = 1;
  loadedWeekPages = 1;
  hasOlderSugar = true;
  loadingOlderSugar = false;
  syncOlderButtons();
  return loadInitialSugarWindow()
    .then(() => {
      createTablePage();
      populateTable();
    })
    .catch((e) => {
      console.error("initial sugar load error:", e);
    });
}
 function bootSugarApp() {
  if (typeof showAppLoader === "function") {
    showAppLoader();
  }
  const isDev =
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  liff
    .init({
      liffId: LIFF_ID,
      withLoginOnExternalBrowser: !isDev,
    })
    .then(() => {
      const idToken = liff.getIDToken();
      sugarState.idToken = idToken;
      const lang = liff.getAppLanguage();
      if (!isSupportedLang(localStorage.getItem(LANG_STORAGE_KEY))) {
        selectedUiLang = normalizeLangToUi(lang);
        localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
      }
      sugarI18nReady
        .then(() => setLanguage(selectedUiLang))
        .catch((error) =>
          console.error("blood sugar language apply failed:", error),
        );

      return Promise.all([startSugarApp(idToken), loadHeader()]);
    })
    .then(() => {
      if (typeof hideAppLoader === "function") {
        hideAppLoader();
      }
    })
    .catch((error) => {
      console.error("LIFF init failed:", error);
      if (typeof hideAppLoader === "function") {
        hideAppLoader();
      }
      alert("LIFF init failed.");
    });
}
