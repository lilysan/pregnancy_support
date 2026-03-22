$(function () {
    // --- Header & Menu Logic ---
    const LANGUAGES = [
        {code: "ja", label: "日本語"},
        {code: "soft", label: "にほんご"},
        {code: "en", label: "English"}
    ]

    // メニュー構造データ
    const MENU_DATA = [
        {
            label: "妊婦健診",
            type: "group",
            children: [
                {
                    label: "コミュニケーションボード",
                    type: "subgroup",
                    items: [
                        { label: "受付", path: "reception" },
                        { label: "診察", path: "examination" },
                        { label: "保健指導", path: "guidance" }
                    ]
                },
                {
                    label: "マイデータ",
                    type: "subgroup",
                    items: [
                        { label: "マイページ設定", path: "mypage" },
                        { label: "ワクチン接種", path: "vaccination" },
                        { label: "バースプラン", path: "birthplan" },
                        { label: "体重", path: "weight" },
                        { label: "血圧", path: "blood_pressure" },
                        { label: "血糖値", path: "blood_sugar" }
                    ]
                },
                {
                    label: "その他",
                    type: "subgroup",
                    items: [
                        { label: "メモ", path: "memo" }
                    ]
                }
            ]
        },
        {
            label: "案内",
            type: "group",
            children: [
                { label: "ガイドブック", path: "guidebook" },
                { label: "よくある質問", path: "faq" },
                { label: "使い方", path: "usage" }
            ]
        },
        {
            label: "チェック",
            type: "group",
            children: [
                { label: "陣痛カウンター", path: "labor_counter" },
                { label: "胎動カウンター", path: "movement_counter" }
            ]
        },
        {
            label: "その他",
            type: "group",
            children: [
                { label: "翻訳アプリ", path: "translation" },
                { label: "データ取得", path: "data" }
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

    /** @type {import('@line/liff').Liff} */
    /** @type {import('i18next').i18n} */
    const liff = window.liff;
    const appLanguageCode = liff.getAppLanguage();
    const normalizedLanguageCode = normalizeLang(appLanguageCode);
    let currentLanguage = LANGUAGES.find(({ code }) => code === normalizedLanguageCode) || {code: "", label: "-"};
    const currentPagePath = typeof currentPage !== 'undefined' ? currentPage : ''; // HTML側で定義された 'currentPage' 変数を取得

    $currentLanguageEl.text(currentLanguage.label);
    renderLanguages();
    renderMenu();

    i18next
        .use(i18nextHttpBackend)
        .use(i18nextBrowserLanguageDetector)
        .init({
            lng: normalizedLanguageCode,
            fallbackLng: "soft",
            interpolation: {
                escapeValue: false // エスケープを無効化
            }
        })
        .then(() => {
            jqueryI18next.init(i18next, $, { useOptionsAttr: true });
            $body.localize();
            document.dispatchEvent(new CustomEvent('i18n-initialized'));
        })
        .catch((err) => {
            console.error("i18next init failed:", err);
        });


    function renderLanguages() {
        $languageList.empty();
        $.each(LANGUAGES, (index, lang) => {
            const $btn = $('<button>').attr('type', 'button').addClass('lang-option').html(`
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
            const $groupTitle = $('<div>').addClass('menu-category-title').text(group.label);
            $menuDropdown.append($groupTitle);

            $.each(group.children, (childIndex, child) => {
                if (child.type === 'subgroup') {
                    // サブカテゴリ (Subgroup)
                    const $subgroupTitle = $('<div>').addClass('menu-subcategory-title').text(child.label);
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
        const $btn = $('<button>').attr('type', 'button').addClass('menu-option');

        // LIFF URLの生成
        const href = item.path ? `https://liff.line.me/${LIFF_ID}/${item.path}/` : '#';

        if (isDisabled) {
            $btn.addClass('is-disabled').attr('disabled', true);
        }

        $btn.html(`
            <span>${item.label}</span>
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
        if (s.startsWith("ko")) return "ko";
        if (s.startsWith("pt")) return "pt";
        if (s.startsWith("ru")) return "ru";
        if (s.startsWith("id")) return "id";
        if (s.startsWith("tl") || s.startsWith("fil")) return "tl";
        if (s.startsWith("zh-tw") || s.startsWith("zh-hk") || s.startsWith("zh-hant")) return "zh-TW";
        if (s.startsWith("zh")) return "zh-CN";
        return "soft";
    }

    function changeLanguage(lang){
        i18next
            .changeLanguage(lang)
            .then(() => $body.localize())
            .catch((err) => console.error("Language switch failed:", err));

        // イベントを発行する
        const event = new CustomEvent('language-changed', { detail: { langId: lang } });
        document.dispatchEvent(event);
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
