// Language and shared state
// Split from blood_sugar/index.html. Loaded as a classic script.

const currentPage = "blood_sugar";
/** @type {import('@line/liff').Liff} */
const liff = window.liff;

const sugarI18n = i18next.createInstance();
const LANG_STORAGE_KEY = "sugar_ui_lang";
const LANGUAGE_OPTIONS = [
  {
    code: "en-US",
    label: "英語編(English)",
  },
  {
    code: "zh",
    label: "中国語編(中文版)",
  },
  {
    code: "fr",
    label: "フランス語編(French)",
  },
  {
    code: "ko",
    label: "韓国語編(Korean)",
  },
  {
    code: "pr",
    label: "ポルトガル語編(Portugues)",
  },
  {
    code: "tl",
    label: "タガログ語編(TAGALOG)",
  },
  {
    code: "ve",
    label: "ベトナム語編(Vietnam)",
  },
  {
    code: "th",
    label: "タイ語編(Thai)",
  },
  {
    code: "de",
    label: "ドイツ語編(German)",
  },
  {
    code: "id",
    label: "インドネシア語(Indonesia)",
  },
  {
    code: "ru",
    label: "ロシア語(Russian)",
  },
  {
    code: "ne",
    label: "ネパール語(Nepali)",
  },
  {
    code: "lo",
    label: "ラオス語(Laotian)",
  },
  {
    code: "uk",
    label: "ウクライナ語(Ukrainian)",
  },
  {
    code: "fa-AF",
    label: "ダリ語(Dari)",
  },
  {
    code: "si",
    label: "シンハラ語(Sinhala)",
  },
  {
    code: "ms",
    label: "マレー語(Malay)",
  },
  {
    code: "my",
    label: "ミャンマー語(Myanmar)",
  },
  {
    code: "bn",
    label: "ベンガル語(Bengali)",
  },
  {
    code: "ur",
    label: "ウルドゥー語(Urdu)",
  },
];
let allData = [];
let token = "";
let userId = "";
let selectedUiLang = "en-US";
let sugarPage = 1;
let loadedWeekPages = 1;
let hasOlderSugar = true;
let loadingOlderSugar = false;
let chartInstances = [];
let currentRow1 = null;
let currentItemId = "";
let before_dateValue = "";
let before_periodValue = 0;
let bloodSugarChart = null;
let sugarI18nReady = Promise.resolve();
 function resolveI18nLang(langCode) {
  if (langCode === "ja") return "ja";
  if (langCode === "zh") return "zh";
  return "en-US";
}
 async function initI18n(langCode) {
  await sugarI18n.use(i18nextHttpBackend).init({
    lng: resolveI18nLang(langCode),
    fallbackLng: "ja",
    ns: ["translation"],
    defaultNS: "translation",
    load: "currentOnly",
    backend: {
      loadPath: "./i18n/{{lng}}.json",
    },
    interpolation: {
      escapeValue: false,
    },
  });
}
 function tx(key, langCode = selectedUiLang) {
  const code = langCode === "ja" ? "ja" : resolveI18nLang(langCode);
  try {
    return sugarI18n.getFixedT(code, "translation")(key);
  } catch (e) {
    return "";
  }
}
 function bt(key) {
  const ja = tx(key, "ja") || key;
  const translated = tx(key, selectedUiLang);
  if (selectedUiLang === "ja" || !translated || translated === ja)
    return ja;
  return `${ja} / ${translated}`;
}
 function normalizeLangToUi(lang) {
  const raw = String(lang || "ja").toLowerCase();
  if (raw.startsWith("zh")) return "zh";
  if (raw.startsWith("fr")) return "fr";
  if (raw.startsWith("ko")) return "ko";
  if (raw.startsWith("pt")) return "pr";
  if (raw.startsWith("tl")) return "tl";
  if (raw.startsWith("vi")) return "ve";
  if (raw.startsWith("th")) return "th";
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("id")) return "id";
  if (raw.startsWith("ru")) return "ru";
  if (raw.startsWith("ne")) return "ne";
  if (raw.startsWith("lo")) return "lo";
  if (raw.startsWith("uk")) return "uk";
  if (raw.startsWith("fa") || raw.startsWith("prs")) return "fa-AF";
  if (raw.startsWith("si")) return "si";
  if (raw.startsWith("ms")) return "ms";
  if (raw.startsWith("my")) return "my";
  if (raw.startsWith("bn")) return "bn";
  if (raw.startsWith("ur")) return "ur";
  if (raw.startsWith("ja")) return "ja";
  return "en-US";
}
 function isSupportedLang(code) {
  return (
    code === "ja" || LANGUAGE_OPTIONS.some((item) => item.code === code)
  );
}

function applyI18n() {
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  setText("titleBs", bt("title"));
  setText("openAddFormBtn", bt("add"));
  setText("labelDate", bt("date"));
  setText("labelPeriod", bt("period"));
  setText("labelSugar", bt("sugar"));
  setText("labelMedication", bt("medication"));
  setText("medicationNoneLabel", bt("medicationNone"));
  setText("medicationYesLabel", bt("medicationYes"));
  setText("labelMedicationUnit", bt("medicationUnit"));
  setText("sugarTargetNote", bt("targetNote"));
  setText("adddata", bt("register"));
  setText("closeAddFormBtn", bt("cancel"));
  setText("thDate", bt("date"));
  setText("thPeriod", bt("periodCol"));
  setText("thSugar", bt("sugar"));
  setText("thMedication", bt("medication"));
  setText("ethDate", bt("date"));
  setText("ethPeriod", bt("periodCol"));
  setText("ethSugar", bt("sugar"));
  setText("ethMedication", bt("medication"));
  setText("ethEdit", bt("edit"));
  setText("editDateLabel", bt("date"));
  setText("editPeriodLabel", bt("period"));
  setText("editSugarLabel", bt("sugar"));
  setText("editMedicationLabel", bt("medication"));
  setText("editMedicationNoneLabel", bt("medicationNone"));
  setText("editMedicationYesLabel", bt("medicationYes"));
  setText("editMedicationUnitLabel", bt("medicationUnit"));
  setText("saveButton", bt("save"));
  setText("cancelButton", bt("cancel"));
  setText("deleteButton", bt("del"));
  setText("tabChart", bt("chart"));
  setText("tabTable", bt("table"));
  setText("tabEdit", bt("edit"));
  setText("periodBeforeBreakfast", bt("beforeBreakfast"));
  setText("periodAfterBreakfast", bt("afterBreakfast"));
  setText("periodBeforeLunch", bt("beforeLunch"));
  setText("periodAfterLunch", bt("afterLunch"));
  setText("periodBeforeDinner", bt("beforeDinner"));
  setText("periodAfterDinner", bt("afterDinner"));
  setText("periodBeforeSleep", bt("beforeSleep"));
  setText("editPeriodBeforeBreakfast", bt("beforeBreakfast"));
  setText("editPeriodAfterBreakfast", bt("afterBreakfast"));
  setText("editPeriodBeforeLunch", bt("beforeLunch"));
  setText("editPeriodAfterLunch", bt("afterLunch"));
  setText("editPeriodBeforeDinner", bt("beforeDinner"));
  setText("editPeriodAfterDinner", bt("afterDinner"));
  setText("editPeriodBeforeSleep", bt("beforeSleep"));
  if (bloodSugarChart) {
    bloodSugarChart.data.datasets[0].label = bt("sugarLabel");
    bloodSugarChart.options.scales.y.title.text = bt("yAxis");
    bloodSugarChart.options.scales.x.title.text = bt("xAxis");
  }
  syncOlderButtons();
  updateChartRangeTitle();
}
 async function setLanguage(langCode) {
  selectedUiLang = isSupportedLang(langCode) ? langCode : "en-US";
  localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
  await sugarI18n.changeLanguage(resolveI18nLang(selectedUiLang));
  applyI18n();
  updateChart(allData);
  createTablePage();
  populateTable();
}
