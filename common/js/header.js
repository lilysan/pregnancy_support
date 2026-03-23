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
        {code: "vi", label: "Tiếng Việt", note: "ベトナム語(Vietnamese)"},
        {code: "th", label: "ภาษาไทย", note: "タイ語(Thai)"},
        {code: "de", label: "Deutsch", note: "ドイツ語(German)"},
        {code: "id", label: "Bahasa Indonesia", note: "インドネシア語(Indonesian)"},
        {code: "ru", label: "Русский язык", note: "ロシア語(Russian)"},
        {code: "ne", label: "नेपाली भाषा", note: "ネパール語(Nepali)"},
        {code: "lo", label: "ພາສາລາວ", note: "ラオス語(Laotian)"},
        {code: "uk", label: "Українська мова", note: "ウクライナ語(Ukrainian)"},
        {code: "prs", label: "زبان دری", note: "ダリ語(Dari)"},
        {code: "si", label: "සිංහල භාෂාව", note: "シンハラ語(Sinhala)"},
        {code: "ms", label: "Bahasa Melayu", note: "マレー語(Malay)"},
        {code: "my", label: "မြန်မာဘာသာ", note: "ミャンマー語(Myanmar)"},
        {code: "bn", label: "বাংলা ভাষা", note: "ベンガル語(Bengali)"},
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
                        { label: "受付", path: "reception", i18n: "title.reception" },
                        { label: "診察", path: "examination", i18n: "title.examination" },
                        { label: "保健指導", path: "guidance", i18n: "title.guidance" },
                    ]
                },
                {
                    label: "マイデータ",
                    i18n: "subgroupTitle.mydata",
                    type: "subgroup",
                    items: [
                        { label: "マイページ設定", path: "mypage", i18n: "title.mypage" },
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
                        { label: "メモ", path: "memo", i18n: "title.memo" },
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
                { label: "よくある質問", path: "faq", i18n: "title.faq" },
                { label: "使い方", path: "usage", i18n: "title.usage" },
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
                { label: "データ取得", path: "data", i18n: "title.data" }
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
    const rtlLangs = new Set(["prs", "ur"]);
    const appLanguageCode = liff.getAppLanguage();
    const normalizedLanguageCode = normalizeLang(appLanguageCode);
    let currentLanguage = LANGUAGES.find(({ code }) => code === normalizedLanguageCode) || {code: "", label: "-", note: "-"};
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
            changeLanguage(normalizedLanguageCode);
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
        const $btn = $('<button>').attr('type', 'button').addClass("menu-option" + (item.path === 'data' ? " staff-only" : ""));

        // LIFF URLの生成
        const href = item.path ? `https://liff.line.me/${LIFF_ID}/${item.path}/` : '#';

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
        return "ja";
    }

    function changeLanguage(lng){
        i18next
            .changeLanguage(lng)
            .then(() => $body.localize())
            .catch((err) => console.error("Language switch failed:", err));

        // 文字の向き LTR or RTL
        $body.attr('dir', rtlLangs.has(lng) ? 'rtl' : 'ltr');

        // データ取得メニューは日本語以外で非表示にする
        $(".staff-only").toggle(lng === "ja");

        // イベントを発行する
        const event = new CustomEvent('language-changed', { detail: { langId: lng } });
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
