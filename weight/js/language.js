// Language and shared state for weight. Loaded as a classic script.

const currentPage = "weight";

const weightI18n = i18next.createInstance();
const LANG_STORAGE_KEY = "weight2_ui_lang";
const PERIOD_PLAN_STORAGE_KEY = "weight_period_plan";
const PERIOD_TIME = {
    1: "06:00",
    2: "12:00",
    3: "18:00"
};
const PERIOD_LABEL = {
    1: "朝",
    2: "昼",
    3: "晩"
};

const LANGUAGE_OPTIONS = [{
        code: "soft",
        label: "やさしい日本語"
    },
    {
        code: "en-US",
        label: "英語編(English)"
    },
    {
        code: "zh",
        label: "中国語編(中文版)"
    },
    {
        code: "fr",
        label: "フランス語編(French)"
    },
    {
        code: "ko",
        label: "韓国語編(Korean)"
    },
    {
        code: "pr",
        label: "ポルトガル語編(Portugues)"
    },
    {
        code: "tl",
        label: "タガログ語編(TAGALOG)"
    },
    {
        code: "ve",
        label: "ベトナム語編(Vietnam)"
    },
    {
        code: "th",
        label: "タイ語編(Thai)"
    },
    {
        code: "de",
        label: "ドイツ語編(German)"
    },
    {
        code: "id",
        label: "インドネシア語(Indonesia)"
    },
    {
        code: "ru",
        label: "ロシア語(Russian)"
    },
    {
        code: "ne",
        label: "ネパール語(Nepali)"
    },
    {
        code: "lo",
        label: "ラオス語(Laotian)"
    },
    {
        code: "uk",
        label: "ウクライナ語(Ukrainian)"
    },
    {
        code: "fa-AF",
        label: "ダリ語(Dari)"
    },
    {
        code: "si",
        label: "シンハラ語(Sinhala)"
    },
    {
        code: "ms",
        label: "マレー語(Malay)"
    },
    {
        code: "my",
        label: "ミャンマー語(Myanmar)"
    },
    {
        code: "bn",
        label: "ベンガル語(Bengali)"
    },
    {
        code: "ur",
        label: "ウルドゥー語(Urdu)"
    }
];

let token = "";
let userId = "";
let allData = [];
let currentPeriod = null;
let weightMonthPage = 1;
let hasOlderWeightMonth = true;
let loadingWeightMonth = false;
let editingItemId = "";
let editingDatetime = "";
let selectedUiLang = "ja";


function getMeta() {
    return currentPeriod || {};
}

function saveMeta(meta) {
    currentPeriod = meta || null;
    if (currentPeriod) {
        localStorage.setItem(PERIOD_PLAN_STORAGE_KEY, JSON.stringify(currentPeriod));
    } else {
        localStorage.removeItem(PERIOD_PLAN_STORAGE_KEY);
    }
}

function loadSavedMeta() {
    try {
        const saved = JSON.parse(localStorage.getItem(PERIOD_PLAN_STORAGE_KEY) || "null");
        const normalized = normalizePeriod(saved);
        if (
            normalized &&
            normalized.startDate &&
            normalized.endDate &&
            Number.isFinite(normalized.startWeightKg) &&
            Number.isFinite(normalized.targetGainKg)
        ) {
            currentPeriod = normalized;
        }
    } catch (error) {
        console.warn("Failed to load local weight period plan:", error);
    }
}

function tx(key, langCode) {
    const rawCode = langCode || selectedUiLang;
    const code = rawCode === "ja" ? "ja" : resolveI18nLang(rawCode);
    try {
        return weightI18n.getFixedT(code, "translation")(key);
    } catch (e) {
        return key;
    }
}

function template(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (_, key) {
        return vars && vars[key] != null ? String(vars[key]) : "";
    });
}

function bt(key) {
    const ja = tx(key, "ja");
    if (selectedUiLang === "ja") return ja;
    return ja + " / " + tx(key, selectedUiLang);
}

function btTemplate(key, vars) {
    const ja = template(tx(key, "ja"), vars);
    if (selectedUiLang === "ja") return ja;
    return ja + " / " + template(tx(key, selectedUiLang), vars);
}

function resolveI18nLang(langCode) {
    if (langCode === "ja") return "ja";
    if (langCode === "soft") return "soft";
    if (isSupportedLang(langCode)) return langCode;
    return "en-US";
}

function loadWeightLanguages(languages) {
    return new Promise(function (resolve, reject) {
        weightI18n.loadLanguages(languages, function (error) {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}

async function initI18n(langCode) {
    const resolved = resolveI18nLang(langCode);
    const languages = Array.from(new Set(["ja", resolved]));
    if (!weightI18n.isInitialized) {
        await weightI18n
            .use(i18nextHttpBackend)
            .init({
                lng: resolved,
                fallbackLng: "ja",
                ns: ["translation"],
                defaultNS: "translation",
                load: "currentOnly",
                backend: {
                    loadPath: "./i18n/{{lng}}.json"
                },
                interpolation: {
                    escapeValue: false
                }
            });
        await loadWeightLanguages(languages);
        return;
    }
    await loadWeightLanguages(languages);
    await weightI18n.changeLanguage(resolved);
}

function isSupportedLang(code) {
    return code === "ja" || LANGUAGE_OPTIONS.some(function (item) {
        return item.code === code;
    });
}

function normalizeLangToUi(lang) {
    const l = String(lang || "ja").toLowerCase();
    if (l === "soft" || l.startsWith("easy") || l.startsWith("simple")) return "soft";
    if (l.startsWith("zh")) return "zh";
    if (l.startsWith("fr")) return "fr";
    if (l.startsWith("ko")) return "ko";
    if (l.startsWith("pt")) return "pr";
    if (l.startsWith("tl")) return "tl";
    if (l.startsWith("vi")) return "ve";
    if (l.startsWith("th")) return "th";
    if (l.startsWith("de")) return "de";
    if (l.startsWith("id")) return "id";
    if (l.startsWith("ru")) return "ru";
    if (l.startsWith("ne")) return "ne";
    if (l.startsWith("lo")) return "lo";
    if (l.startsWith("uk")) return "uk";
    if (l.startsWith("fa") || l.startsWith("prs")) return "fa-AF";
    if (l.startsWith("si")) return "si";
    if (l.startsWith("ms")) return "ms";
    if (l.startsWith("my")) return "my";
    if (l.startsWith("bn")) return "bn";
    if (l.startsWith("ur")) return "ur";
    if (l.startsWith("en")) return "en-US";
    return "ja";
}

function renderLanguageOptions() {
    const list = document.getElementById("languageOptionList");
    if (!list) return;
    list.innerHTML = "";

    const jaBtn = document.createElement("button");
    jaBtn.type = "button";
    jaBtn.className = "language-option-btn" + (selectedUiLang === "ja" ? " active" : "");
    jaBtn.textContent = "日本語";
    jaBtn.onclick = function () {
        setLanguage("ja");
    };
    list.appendChild(jaBtn);

    LANGUAGE_OPTIONS.forEach(function (lang) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "language-option-btn" + (selectedUiLang === lang.code ? " active" : "");
        btn.textContent = lang.label;
        btn.onclick = function () {
            setLanguage(lang.code);
        };
        list.appendChild(btn);
    });
}

async function setLanguage(langCode) {
    selectedUiLang = isSupportedLang(langCode) ? langCode : "ja";
    localStorage.setItem(LANG_STORAGE_KEY, selectedUiLang);
    await initI18n(selectedUiLang);
    applyI18n();
    renderTable();
    renderSummary();
    syncPeriodNav();
    renderLanguageOptions();
}

document.addEventListener("language-changed", function (event) {
    const nextLang = normalizeLangToUi(event && event.detail ? event.detail.langId : "");
    setLanguage(nextLang).catch(function (error) {
        console.error("Weight language switch failed:", error);
    });
});

function applyI18n() {
    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };
    const setPlaceholder = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("placeholder", value);
    };
    document.title = tx("pageTitle", selectedUiLang);
    setText("pageTitle", bt("pageTitle"));
    setText("pageLead", bt("pageLead"));
    setText("planTitle", bt("planTitle"));
    setText("labelPeriodStartDate", bt("periodStartDate"));
    setText("labelStartWeightKg", bt("startWeightKg"));
    setText("labelTargetEndDate", bt("targetEndDate"));
    setText("labelTargetGainKg", bt("targetGainKg"));
    setText("savePlanBtn", bt("savePlan"));
    setText("summaryTitle", bt("summaryTitle"));
    setText("summaryLabelPeriod", bt("summaryPeriod"));
    setText("summaryLabelStartWeight", bt("summaryStartWeight"));
    setText("summaryLabelLatestWeight", bt("summaryLatestWeight"));
    setText("summaryLabelCurrentGain", bt("summaryCurrentGain"));
    setText("summaryLabelTargetWeight", bt("summaryTargetWeight"));
    setText("summaryLabelRemaining", bt("summaryRemaining"));
    setText("progressLabel", bt("progressLabel"));
    setText("recordTitle", bt("recordTitle"));
    setText("labelWeightDate", bt("date"));
    setText("labelWeightPeriod", bt("weightPeriod"));
    setText("labelWeightValue", bt("weightValue"));
    setText("addWeightBtn", bt("addWeight"));
    setText("loadOlderChartBtn", bt("loadOlderMonth"));
    setText("loadOlderTableBtn", bt("loadOlderMonth"));
    setText("loadOlderEditBtn", bt("loadOlderMonth"));
    setText("periodMorning", bt("morning"));
    setText("periodNoon", bt("noon"));
    setText("periodEvening", bt("evening"));
    setText("chartTitle", bt("chartTitle"));
    setText("tabOverview", bt("tabChart"));
    setText("tabTable", bt("tabTable"));
    setText("tabList", bt("tabList"));
    setText("tableTitle", bt("tableTitle"));
    setText("editTableTitle", bt("editTableTitle"));
    setText("tableEmpty", bt("tableEmpty"));
    setText("tableOnlyEmpty", bt("tableEmpty"));
    setText("thDate", bt("thDate"));
    setText("thPeriod", bt("thPeriod"));
    setText("thWeight", bt("thWeight"));
    setText("thGain", bt("thGain"));
    setText("thEdit", bt("thEdit"));
    setText("tableThDate", bt("thDate"));
    setText("tableThPeriod", bt("thPeriod"));
    setText("tableThWeight", bt("thWeight"));
    setText("tableThGain", bt("thGain"));
    setText("editDialogTitle", bt("editDialogTitle"));
    setText("editLabelWeightDate", bt("date"));
    setText("editLabelWeightPeriod", bt("weightPeriod"));
    setText("editLabelWeightValue", bt("weightValue"));
    setText("editPeriodMorning", bt("morning"));
    setText("editPeriodNoon", bt("noon"));
    setText("editPeriodEvening", bt("evening"));
    setText("saveEditBtn", bt("save"));
    setText("cancelEditBtn", bt("cancel"));
    setText("deleteEditBtn", bt("delete"));
    setPlaceholder("periodStartDate", tx("placeholderDate", selectedUiLang));
    setPlaceholder("targetEndDate", tx("placeholderDate", selectedUiLang));
    setPlaceholder("startWeightKg", tx("placeholderStartWeight", selectedUiLang));
    setPlaceholder("targetGainKg", tx("placeholderTargetGain", selectedUiLang));
    setPlaceholder("weightDate", tx("placeholderDate", selectedUiLang));
    setPlaceholder("weightValue", tx("placeholderWeight", selectedUiLang));
    chart.data.datasets[0].label = bt("chartWeightLabel");
    chart.data.datasets[1].label = bt("chartGoalLabel");
    chart.options.scales.y.title.text = bt("chartWeightLabel");
    chart.update();
}


function formatDateTime(date, period) {
    return date + " " + (PERIOD_TIME[String(period)] || "06:00");
}

function parseDateOnly(value) {
    return new Date(String(value) + "T00:00:00");
}

function formatDateJP(value) {
    if (!value) return "-";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return (d.getMonth() + 1) + "/" + d.getDate();
}

function formatWeight(value) {
    return Number.isFinite(value) ? value.toFixed(1) + " kg" : "-";
}

function formatSignedKg(value) {
    if (!Number.isFinite(value)) return "-";
    return (value > 0 ? "+" : "") + value.toFixed(1) + " kg";
}

function sortWeightData(items) {
    return (items || []).slice().sort(function (a, b) {
        return new Date(String(a.datetime || "")).getTime() - new Date(String(b.datetime || ""))
            .getTime();
    });
}
