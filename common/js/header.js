$(function () {
    // --- Header & Menu Logic ---
    const LANGUAGES = [
        {code: "ja", label: "日本語", note: "日本語(Japanese)"},
        {code: "soft", label: "やさしいにほんご", note: "やさしい日本語(Easy Japanese)"},
        {code: "en", label: "English", note: "英語(English)"},
        {code: "zh", label: "中文", note: "中国語(Chinese)"},
        {code: "fr", label: "Français", note: "フランス語(French)"},
        {code: "ko", label: "한국어", note: "韓国語(Korean)"},
        {code: "pt", label: "Português", note: "ポルトガル語(Portuguese)"},
        {code: "tl", label: "Tagalog", note: "タガログ語(Tagalog)"},
        {code: "vi", label: "Việt", note: "ベトナム語(Vietnamese)"},
        {code: "th", label: "ไทย", note: "タイ語(Thai)"},
        {code: "de", label: "Deutsch", note: "ドイツ語(German)"},
        {code: "id", label: "Indonesia", note: "インドネシア語(Indonesian)"},
        {code: "ru", label: "Русский", note: "ロシア語(Russian)"},
        {code: "ne", label: "नेपाली", note: "ネパール語(Nepali)"},
        {code: "lo", label: "ລາວ", note: "ラオス語(Laotian)"},
        {code: "uk", label: "Українська", note: "ウクライナ語(Ukrainian)"},
        {code: "prs", label: "دری", note: "ダリ語(Dari)"},
        {code: "si", label: "සිංහල", note: "シンハラ語(Sinhala)"},
        {code: "ms", label: "Melayu", note: "マレー語(Malay)"},
        {code: "my", label: "မြန်မာ", note: "ミャンマー語(Myanmar)"},
        {code: "bn", label: "বাংলা", note: "ベンガル語(Bengali)"},
        {code: "ur", label: "اردو", note: "ウルドゥー語(Urdu)"}
    ];

    // メニュー構造データ
    const MENU_DATA = [
        {
            label: "妊婦健診",
            i18n: "groupTitle.checkup",
            type: "group",
            children: [
                {
                    label: "コミュニケーションボード",
                    i18n: "subgroupTitle.board",
                    type: "subgroup",
                    items: [
                        { label: "受付", path: "reception", i18n: "title.reception", external: true },
                        { label: "診察", path: "examination", i18n: "title.examination", external: true },
                        { label: "保健指導", path: "guidance", i18n: "title.guidance", external: true },
                    ]
                },
                {
                    label: "マイデータ",
                    i18n: "subgroupTitle.mydata",
                    type: "subgroup",
                    items: [
                        { label: "プロフィール登録", path: "mypage", i18n: "title.mypage" },
                        { label: "ワクチン接種", path: "vaccination", i18n: "title.vaccination" },
                        { label: "バースプラン", path: "birthplan", i18n: "title.birthplan" },
                        { label: "体重", path: "weight", i18n: "title.weight" },
                        { label: "血圧", path: "blood_pressure", i18n: "title.bloodPressure" },
                        { label: "血糖値", path: "blood_sugar", i18n: "title.bloodSugar" },
                    ]
                },
                {
                    label: "その他",
                    i18n: "subgroupTitle.other",
                    type: "subgroup",
                    items: [
                        { label: "メモ", path: "note", i18n: "title.memo" },
                    ]
                }
            ]
        },
        {
            label: "案内",
            i18n: "groupTitle.info",
            type: "group",
            children: [
                { label: "ガイドブック", path: "guidebook", i18n: "title.guidebook" },
                { label: "出産・育児にかかわる制度", path: "systeminformation", i18n: "title.systemInformation" },
                { label: "日本の出産スタンダード", path: "aruaru", i18n: "title.standard" },
                { label: "よくある質問", path: "qanda", i18n: "title.faq" },
                { label: "使い方", path: "instructions", i18n: "title.usage" },
                { label: "プライバシーポリシー・データセキュリティと保護", path: "privacy", i18n: "title.privacy" },
            ]
        },
        {
            label: "チェック",
            i18n: "groupTitle.check",
            type: "group",
            children: [
                { label: "陣痛カウンター", path: "labor_counter", i18n: "title.laborCounter" },
                { label: "胎動カウンター", path: "movement_counter", i18n: "title.movementCounter" }
            ]
        },
        {
            label: "その他",
            i18n: "groupTitle.other",
            type: "group",
            children: [
                { label: "翻訳アプリ", path: "translation", i18n: "title.translation" },
                { label: "病院情報＜スタッフ専用＞", path: "hospital", i18n: "title.hospital" },
                { label: "患者データ＜スタッフ専用＞", path: "data", i18n: "title.data" },

            ]
        }
    ];

    const $currentLanguageEl = $('#currentLanguage');
    const $languageList = $('#languageList');
    const $languageDropdown = $('#languageDropdown');
    const $menuOverlay = $('#menuOverlay');
    const $menuDropdown = $('#menuDropdown');
    const $langBtn = $('#langBtn');
    const $menuBtn = $('#menuBtn');
    const $menuCloseBtn = $('#menuCloseBtn');
    const $body = $('body');
    const appRootUrl = getAppRootUrl();

    /** @type {import('@line/liff').Liff} */
    /** @type {import('i18next').i18n} */
    const liff = window.liff;
    const rtlLangs = new Set(["prs", "ur"]);
    const appLanguageCode = liff.getAppLanguage();
    const normalizedLanguageCode = normalizeLang(appLanguageCode);
    window.normalizedLanguageCode = normalizedLanguageCode;
    let currentLanguage = LANGUAGES.find(({ code }) => code === normalizedLanguageCode) || {code: "", label: "-", note: "-"};
    let languageSwitchRequestId = 0;
    const currentPagePath = typeof currentPage !== 'undefined' && currentPage ? currentPage : getCurrentPagePath(appRootUrl);

    $currentLanguageEl.text(currentLanguage.label);
    $(".site-title-logo").attr("src", new URL("common/assets/logo.svg", appRootUrl).href);
    renderLanguages();
    renderMenu();

    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            lng: normalizedLanguageCode,
            fallbackLng: "soft",
            backend: {
                loadPath: `${appRootUrl.href}locales/{{lng}}/{{ns}}.json`
            },
            interpolation: {
                escapeValue: false // エスケープを無効化
            }
        })
        .then(() => {
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });
            return changeLanguage(normalizedLanguageCode);
        })
        .then(() => {
            document.dispatchEvent(new CustomEvent('i18n-initialized'));
        })
        .catch((err) => {
            console.error("i18next init failed:", err);
        });


    function renderLanguages() {
        $languageList.empty();
        $.each(LANGUAGES, (index, lang) => {
            const $btn = $('<button>').attr('type', 'button').attr('dir', rtlLangs.has(lang.code) ? 'rtl' : 'ltr').addClass('lang-option').html(`
                    <span>${lang.label}</span>
                    ${lang.code === currentLanguage.code ? '<iconify-icon icon="material-symbols:check-rounded" width="20" height="20" style="color:var(--primary-dark)"></iconify-icon>' : ''}
                `);
            if (lang.code === currentLanguage.code) {
                $btn.addClass('is-active');
            }
            $btn.on('click', () => {
                currentLanguage = lang;
                $currentLanguageEl.text(lang.label);
                changeLanguage(lang.code);
                renderLanguages();
                closeMenus();
            });
            $languageList.append($btn);
        });
    }

    // メニュー生成ロジック
    function renderMenu() {
        $menuDropdown.empty();

        $.each(MENU_DATA, (index, group) => {
            // 大カテゴリ (Group)
            const $groupTitle = $('<div>').attr('data-i18n', "[html]" + group.i18n).addClass('menu-category-title').text(group.label);
            $menuDropdown.append($groupTitle);

            $.each(group.children, (childIndex, child) => {
                if (child.type === 'subgroup') {
                    // サブカテゴリ (Subgroup)
                    const $subgroupTitle = $('<div>').attr('data-i18n', "[html]" + child.i18n).addClass('menu-subcategory-title').text(child.label);
                    $menuDropdown.append($subgroupTitle);

                    // サブカテゴリ内のアイテム
                    $.each(child.items, (itemIndex, item) => {
                        $menuDropdown.append(createMenuItem(item));
                    });
                } else {
                    // 直接のアイテム (Item)
                    $menuDropdown.append(createMenuItem(child));
                }
            });
        });
    }

    function createMenuItem(item) {
        // currentPagePath と item.path を比較
        const isDisabled = item.path === currentPagePath;
        const isStaffOnly = item.path === 'data' || item.path === 'hospital';
        const $btn = $('<button>').attr('type', 'button').addClass("menu-option" + (isStaffOnly ? " staff-only" : ""));

        const href = getMenuItemHref(item);

        if (isDisabled) {
            $btn.addClass('is-disabled').attr('disabled', true);
        }

        $btn.html(`
            <span data-i18n="[html]${item.i18n}">${item.label}</span>
            <iconify-icon icon="material-symbols:chevron-right-rounded" width="20" height="20" style="color:var(--sub-text)"></iconify-icon>
        `);

        $btn.on('click', () => {
            if (!isDisabled) {
                window.location.href = href;
            }
            closeMenus();
        });
        return $btn;
    }

    function getMenuItemHref(item) {
        if (!item.path) {
            return '#';
        }

        if (item.external) {
            return `https://lilysan.github.io/pregnancy_support/${item.path}/?openExternalBrowser=1`;
        }

        return `https://liff.line.me/${LIFF_ID}/${item.path}/`;
    }

    function getAppRootUrl() {
        const scriptUrl = getCommonScriptUrl("config.js") || getCommonScriptUrl("header.js");
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
        if (document.currentScript && document.currentScript.src) {
            return document.currentScript.src;
        }

        const scripts = Array.from(document.scripts);
        const commonScript = scripts.find((script) => script.src.endsWith(`/common/js/${fileName}`));
        return commonScript ? commonScript.src : "";
    }

    function closeMenus() {
        $languageDropdown.removeClass('is-open');
        $menuOverlay.removeClass('is-open');
        $body.removeClass('no-scroll');
        $langBtn.attr('aria-expanded', 'false');
        $menuBtn.attr('aria-expanded', 'false');
    }

    function normalizeLang(raw) {
        const s = (raw || "").toLowerCase();
        if (s.startsWith("ja")) return "ja";
        if (s.startsWith("en")) return "en";
        if (s.startsWith("zh")) return "zh";
        if (s.startsWith("fr")) return "fr";
        if (s.startsWith("ko")) return "ko";
        if (s.startsWith("pt")) return "pt";
        if (s.startsWith("vi")) return "vi";
        if (s.startsWith("th")) return "th";
        if (s.startsWith("de")) return "de";
        if (s.startsWith("ru")) return "ru";
        if (s.startsWith("id")) return "id";
        if (s.startsWith("ne")) return "ne";
        if (s.startsWith("lo")) return "lo";
        if (s.startsWith("uk")) return "uk";
        if (s.startsWith("fa-af") || s.startsWith("prs") || s.startsWith("fa")) return "prs";
        if (s.startsWith("si")) return "si";
        if (s.startsWith("ms")) return "ms";
        if (s.startsWith("my")) return "my";
        if (s.startsWith("bn")) return "bn";
        if (s.startsWith("ur")) return "ur";
        if (s.startsWith("tl") || s.startsWith("fil")) return "tl";
        return "en";
    }

    function changeLanguage(lng){
        const requestId = ++languageSwitchRequestId;
        window.normalizedLanguageCode = lng;

        // 文字の向き LTR or RTL
        $body.attr('dir', rtlLangs.has(lng) ? 'rtl' : 'ltr');

        // データ取得メニューは日本語以外で非表示にする
        $(".staff-only").toggle(lng === "ja");

        return i18next
            .changeLanguage(lng)
            .then(() => {
                if (requestId !== languageSwitchRequestId) {
                    return;
                }
                $body.localize();
                document.dispatchEvent(new CustomEvent('language-changed', { detail: { langId: lng } }));
            })
            .catch((err) => console.error("Language switch failed:", err));
    }

    $langBtn.on('click', () => {
        const willOpen = !$languageDropdown.hasClass('is-open');
        closeMenus();
        if (willOpen) {
            $languageDropdown.addClass('is-open');
            $langBtn.attr('aria-expanded', 'true');
        }
    });

    $menuBtn.on('click', () => {
        $menuOverlay.addClass('is-open');
        $body.addClass('no-scroll');
        $menuBtn.attr('aria-expanded', 'true');
    });

    $menuCloseBtn.on('click', () => {
        closeMenus();
    });

    $(document).on('mousedown', (e) => {
        if (!$(e.target).closest('#headerMenuGroup').length && !$(e.target).closest('#menuOverlay').length) {
            closeMenus();
        }
    });
});
