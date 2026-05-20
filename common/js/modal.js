(function (window, $) {
    'use strict';

    function createModalManager(options) {
        const settings = Object.assign({
            rootSelector: '#modalOverlay',
            dialogSelector: '#modalDialog',
            titleSelector: '#modalTitle',
            messageSelector: '#modalMessage',
            closeSelector: '#modalCloseBtn',
            negativeSelector: '#modalNegativeBtn',
            positiveSelector: '#modalPositiveBtn',
            autoMount: true,
            mountTargetSelector: 'body',
            closeOnOverlay: true,
            closeOnEscape: true
        }, options || {});

        if (settings.autoMount) {
            ensureMounted(settings);
        }

        const $root = $(settings.rootSelector);
        const $dialog = $(settings.dialogSelector);
        const $title = $(settings.titleSelector);
        const $message = $(settings.messageSelector);
        const $close = $(settings.closeSelector);
        const $negative = $(settings.negativeSelector);
        const $positive = $(settings.positiveSelector);
        let currentConfig = {};
        let resolveAction;

        bindEvents();

        function show(config) {
            if (!$root.length || !$dialog.length) {
                return;
            }

            currentConfig = Object.assign({
                title: '',
                message: '',
                positiveText: 'OK',
                negativeText: null,
                closeLabel: '閉じる'
            }, config || {});

            $title.text(currentConfig.title);
            setMessage(currentConfig);
            $close.attr('aria-label', currentConfig.closeLabel);

            if (currentConfig.negativeText) {
                $negative.text(currentConfig.negativeText).show();
            } else {
                $negative.hide();
            }

            if (currentConfig.positiveText) {
                $positive.text(currentConfig.positiveText).show();
            } else {
                $positive.hide();
            }

            $root.addClass('is-open');
            $('body').addClass('no-scroll');
            $dialog.attr('tabindex', '-1').trigger('focus');

            return new Promise((resolve) => {
                resolveAction = resolve;
            });
        }

        function hide(action) {
            if (!$root.hasClass('is-open')) {
                return;
            }

            $root.removeClass('is-open');
            $('body').removeClass('no-scroll');

            if (typeof currentConfig.onClose === 'function') {
                currentConfig.onClose(action);
            }

            if (typeof resolveAction === 'function') {
                resolveAction(action);
                resolveAction = undefined;
            }

            currentConfig = {};
        }

        function bindEvents() {
            $close.on('click', () => hide('close'));
            $negative.on('click', () => {
                if (runHandler(currentConfig.onNegative) !== false) {
                    hide('negative');
                }
            });
            $positive.on('click', () => {
                if (runHandler(currentConfig.onPositive) !== false) {
                    hide('positive');
                }
            });

            $root.on('click', function (e) {
                if (settings.closeOnOverlay && e.target === this) {
                    hide('overlay');
                }
            });

            if (settings.closeOnEscape) {
                $(document).on('keydown.modalManager', (e) => {
                    if (e.key === 'Escape') {
                        hide('escape');
                    }
                });
            }
        }

        function runHandler(handler) {
            if (typeof handler !== 'function') {
                return undefined;
            }
            return handler();
        }

        function setMessage(config) {
            if (config.messageHtml) {
                $message.html(config.messageHtml);
                return;
            }
            $message.text(config.message || '');
        }

        return {
            show,
            hide
        };
    }

    function ensureMounted(settings) {
        if ($(settings.rootSelector).length) {
            return;
        }

        const $target = $(settings.mountTargetSelector).first();
        const $mountPoint = $target.length ? $target : $('body');
        $mountPoint.append(defaultModalMarkup(settings));
    }

    function defaultModalMarkup(settings) {
        return `
            <div class="overlay" id="${toId(settings.rootSelector)}">
                <div class="modal" id="${toId(settings.dialogSelector)}" role="dialog" aria-modal="true" aria-labelledby="${toId(settings.titleSelector)}">
                    <button class="modal-close" id="${toId(settings.closeSelector)}" type="button" aria-label="閉じる">
                        <iconify-icon icon="material-symbols:close-rounded" width="22" height="22"></iconify-icon>
                    </button>
                    <p class="h3-sample modal-title" id="${toId(settings.titleSelector)}"></p>
                    <p class="modal-message" id="${toId(settings.messageSelector)}"></p>
                    <div class="modal-actions">
                        <button class="btn secondary" id="${toId(settings.negativeSelector)}" type="button"></button>
                        <button class="btn primary" id="${toId(settings.positiveSelector)}" type="button"></button>
                    </div>
                </div>
            </div>
        `;
    }

    function toId(selector) {
        return selector.charAt(0) === '#' ? selector.slice(1) : selector;
    }

    window.createModalManager = createModalManager;
}(window, window.jQuery));
