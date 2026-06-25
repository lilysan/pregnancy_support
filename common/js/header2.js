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
                        {label: "受付", path: "reception"},
                        {label: "診察", path: "examination"},
                        {label: "保健指導", path: "guidance"},
                    ]
                },
                {
                    label: "マイデータ",
                    type: "subgroup",
                    items: [
                        {label: "マイページ設定", path: "mypage"},
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
                {label: "周産期制度・システム", path: "systeminformation"},
                {label: "日本の出産スタンダード", path: "aruaru"},
                {label: "妊娠中の性交渉について", path: "aboutsex"},
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
    $("#langBtn, #languageDropdown").remove();
    $(".divider-v").remove();

    const $menuOverlay = $("#menuOverlay");
    const $menuDropdown = $("#menuDropdown");
    const $menuBtn = $("#menuBtn");
    const $menuCloseBtn = $("#menuCloseBtn");
    const $body = $("body");

    renderMenu();

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
                window.location.href = `https://liff.line.me/${LIFF_ID}/${item.path}/`;
            }
            closeMenus();
        });

        return $btn;
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
