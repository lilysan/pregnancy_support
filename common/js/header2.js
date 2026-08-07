$(function () {
    const MENU_DATA = [
        {
            label: "妊婦健診",
            type: "group",
            children: [
                {
                    label: "コミュニケーションボード",
                    type: "subgroup",
                    items: [
                        {label: "受付", path: "reception", external: true},
                        {label: "診察", path: "examination", external: true},
                        {label: "保健指導", path: "guidance", external: true},
                    ]
                },
                {
                    label: "マイデータ",
                    type: "subgroup",
                    items: [
                        {label: "プロフィール登録", path: "mypage"},
                        {label: "ワクチン接種", path: "vaccination"},
                        {label: "バースプラン", path: "birthplan"},
                        {label: "体重", path: "weight"},
                        {label: "血圧", path: "blood_pressure"},
                        {label: "血糖値", path: "blood_sugar"},
                    ]
                },
                {
                    label: "その他",
                    type: "subgroup",
                    items: [
                        {label: "メモ", path: "note"},
                    ]
                }
            ]
        },
        {
            label: "案内",
            type: "group",
            children: [
                {label: "ガイドブック", path: "guidebook"},
                {label: "出産・育児にかかわる制度", path: "systeminformation"},
                {label: "日本の出産スタンダード", path: "aruaru"},
                {label: "よくある質問", path: "qanda"},
                {label: "使い方", path: "usage"},
            ]
        },
        {
            label: "チェック",
            type: "group",
            children: [
                {label: "陣痛カウンター", path: "labor_counter"},
                {label: "胎動カウンター", path: "movement_counter"}
            ]
        },
        {
            label: "その他",
            type: "group",
            children: [
                {label: "翻訳アプリ", path: "translation"},
                {label: "病院情報＜スタッフ専用＞", path: "hospital"},
                {label: "患者データ＜スタッフ専用＞", path: "data"},
            ]
        }
    ];

    const appRootUrl = getAppRootUrl();
    const currentPagePath = typeof currentPage !== "undefined" && currentPage ? currentPage : getCurrentPagePath(appRootUrl);

    $(".site-title-logo").attr("src", new URL("common/assets/logo.svg", appRootUrl).href);
    $("#languageDropdown").remove();
    $("#currentLanguage").text(getPageLanguageLabel());

    const $menuOverlay = $("#menuOverlay");
    const $menuDropdown = $("#menuDropdown");
    const $langBtn = $("#langBtn");
    const $menuBtn = $("#menuBtn");
    const $menuCloseBtn = $("#menuCloseBtn");
    const $body = $("body");

    renderMenu();

    $langBtn.on("click", () => {
        const languageButton = document.getElementById("languageSettingBtn");
        if (languageButton) {
            languageButton.click();
        }
    });
    $menuBtn.on("click", () => {
        $menuOverlay.addClass("is-open");
        $body.addClass("no-scroll");
        $menuBtn.attr("aria-expanded", "true");
    });
    $menuCloseBtn.on("click", closeMenus);
    $menuOverlay.on("click", (event) => {
        if (event.target === $menuOverlay[0]) {
            closeMenus();
        }
    });

    function renderMenu() {
        $menuDropdown.empty();

        MENU_DATA.forEach((group) => {
            $menuDropdown.append($("<div>").addClass("menu-category-title").text(group.label));

            group.children.forEach((child) => {
                if (child.type === "subgroup") {
                    $menuDropdown.append($("<div>").addClass("menu-subcategory-title").text(child.label));
                    child.items.forEach((item) => {
                        $menuDropdown.append(createMenuItem(item));
                    });
                } else {
                    $menuDropdown.append(createMenuItem(child));
                }
            });
        });
    }

    function getPageLanguageLabel() {
        const savedKeys = [
            "aruaruSelectedLanguage",
            "aboutsexSelectedLanguage",
            "receptionSelectedLanguage",
            "examinationSelectedLanguage",
            "selectedLanguage",
        ];
        const labels = {
            ja: "やさしい",
            "en-US": "English",
            zh: "中文",
            fr: "Français",
            ko: "한국어",
            pr: "Português",
            tl: "Tagalog",
            ve: "Tiếng Việt",
            th: "ภาษาไทย",
            de: "Deutsch",
            id: "Indonesia",
            ru: "Русский",
            ne: "नेपाली",
            lo: "ລາວ",
            uk: "Українська",
            "fa-AF": "دری",
            si: "සිංහල",
            ms: "Melayu",
            my: "မြန်မာ",
            bn: "বাংলা",
            ur: "اردو",
        };
        const saved = savedKeys.map((key) => localStorage.getItem(key)).find(Boolean);
        return labels[saved] || "Language";
    }

    function createMenuItem(item) {
        const isCurrent = item.path === currentPagePath;
        const $btn = $("<button>")
            .attr("type", "button")
            .addClass("menu-option" + (item.path === "data" ? " staff-only" : ""))
            .prop("disabled", isCurrent)
            .toggleClass("is-disabled", isCurrent)
            .html(`
                <span>${item.label}</span>
                <iconify-icon icon="material-symbols:chevron-right-rounded" width="20" height="20" style="color:var(--sub-text)"></iconify-icon>
            `);

        $btn.on("click", () => {
            if (!isCurrent) {
                window.location.href = getMenuItemHref(item);
            }
            closeMenus();
        });

        return $btn;
    }

    function getMenuItemHref(item) {
        if (!item.path) {
            return "#";
        }

        if (item.external) {
            return `https://lilysan.github.io/pregnancy_support/${item.path}/?openExternalBrowser=1`;
        }

        return `https://liff.line.me/${LIFF_ID}/${item.path}/`;
    }

    function closeMenus() {
        $menuOverlay.removeClass("is-open");
        $body.removeClass("no-scroll");
        $menuBtn.attr("aria-expanded", "false");
    }

    function getAppRootUrl() {
        const scriptUrl = getCommonScriptUrl("config.js") || getCommonScriptUrl("header2.js");
        if (scriptUrl) {
            return new URL("../../", scriptUrl);
        }

        if (window.location.hostname.endsWith(".github.io")) {
            const repositoryName = window.location.pathname.split("/").filter(Boolean)[0];
            if (repositoryName) {
                return new URL(`/${repositoryName}/`, window.location.origin);
            }
        }

        return new URL("/", window.location.origin);
    }

    function getCurrentPagePath(appRootUrl) {
        const rootPath = appRootUrl && appRootUrl.pathname ? appRootUrl.pathname : "/";
        const currentPath = window.location.pathname;
        const relativePath = currentPath.startsWith(rootPath)
            ? currentPath.slice(rootPath.length)
            : currentPath.replace(/^\/+/, "");
        const firstSegment = relativePath.split("/").filter(Boolean)[0] || "";
        return firstSegment.replace(/\/?index\.html$/, "");
    }

    function getCommonScriptUrl(fileName) {
        const scripts = Array.from(document.scripts);
        const commonScript = scripts.find((script) => script.src.endsWith(`/common/js/${fileName}`));
        return commonScript ? commonScript.src : "";
    }
});
