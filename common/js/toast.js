(function (window, $) {
    'use strict';

    function createToastManager(options) {
        const settings = Object.assign({
            rootSelector: '#toast',
            innerSelector: '#toastInner',
            titleSelector: '#toastTitle',
            messageSelector: '#toastMessage',
            iconSelector: '#toastIcon',
            autoCloseMs: 5000,
            autoMount: true,
            mountTargetSelector: 'main'
        }, options || {});

        if (settings.autoMount) {
            ensureMounted(settings);
        }

        const $root = $(settings.rootSelector);
        const $inner = $(settings.innerSelector);
        const $title = $(settings.titleSelector);
        const $message = $(settings.messageSelector);
        const $icon = $(settings.iconSelector);
        let timerId;

        function show(config) {
            if (!config || !$root.length || !$inner.length) {
                return;
            }

            $inner.css({
                border: `1px solid ${config.color}`,
                background: config.bg
            });
            $title.text(config.title || '');
            $message.text(config.message || '');
            $icon.attr('icon', config.icon || '').css('color', config.color || '');

            $root.addClass('is-open');
            clearTimeout(timerId);
            timerId = setTimeout(hide, settings.autoCloseMs);
        }

        function showByType(type, typeMap) {
            if (!typeMap || !typeMap[type]) {
                return;
            }
            show(typeMap[type]);
        }

        function bindByDataAttr(typeMap, selector) {
            const targetSelector = selector || '[data-toast]';
            $(document).on('click', targetSelector, function (e) {
                const type = $(e.currentTarget).data('toast');
                showByType(type, typeMap);
            });
        }

        function hide() {
            $root.removeClass('is-open');
        }

        return {
            show,
            showByType,
            bindByDataAttr,
            hide
        };
    }

    function ensureMounted(settings) {
        if ($(settings.rootSelector).length) {
            return;
        }

        const $target = $(settings.mountTargetSelector).first();
        const $mountPoint = $target.length ? $target : $('body');
        $mountPoint.prepend(defaultToastMarkup());
    }

    function defaultToastMarkup() {
        return `
            <div class="toast" id="toast">
                <div class="toast-inner" id="toastInner">
                    <iconify-icon id="toastIcon" width="22" height="22"></iconify-icon>
                    <div>
                        <p id="toastTitle" class="bold"></p>
                        <p class="caption-sample" id="toastMessage"></p>
                    </div>
                </div>
            </div>
        `;
    }

    window.createToastManager = createToastManager;
}(window, window.jQuery));
