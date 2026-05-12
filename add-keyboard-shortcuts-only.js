const fs = require('fs');

// Read the file
let content = fs.readFileSync('KTL.js', 'utf8');

// Find the line number for "End of KTL"
const lines = content.split('\n');
const endOfKtlIndex = lines.findIndex(line => line.includes('////////////////  End of KTL /////////////////////'));

if (endOfKtlIndex === -1) {
    console.error('Could not find "End of KTL" marker');
    process.exit(1);
}

// Insert the keyboard shortcut code BEFORE the "End of KTL" line
const keyboardShortcutCode = `
// KTL Dev Popup: keyboard shortcuts for copying Scene/View/Field/Object IDs
(function attachKtlDevPopupShortcuts() {
    // ==== Vars ====
    const FLAG_NAME = 'ktlDevPopupShortcutsAttached';
    const POPOVER_SELECTOR = '#kn-popover';
    const INPUT_BLOCK_SELECTOR = 'input, textarea, [contenteditable]';
    const KEY_VIEW = 'v';
    const KEY_SCENE = 's';
    const KEY_FIELD = 'f';
    const KEY_OBJECT = 'o';

    // ==== Guard ====
    if (window[FLAG_NAME]) return;

    // ==== Helpers ====
    function getVisiblePopover() {
        const $p = $(POPOVER_SELECTOR);
        return ($p.length && $p.is(':visible')) ? $p : null;
    }

    function clickCopyFor(prefix) {
        const $popover = getVisiblePopover();
        if (!$popover) return;

        // direct children only: #kn-popover > div > div
        const $line = $popover.children('div').children('div').filter(function () {
            const $span = $(this).children('span').first();
            return $span.length && $span.text().trim().startsWith(prefix);
        }).first();

        if ($line.length) {
            const $btn = $line.children('a').find('.fa-copy').first();
            if ($btn.length) $btn.get(0).click();
        }
    }

    function onKeydown(e) {
        if (!getVisiblePopover()) return;
        if ($(e.target).is(INPUT_BLOCK_SELECTOR)) return;
        if (e.ctrlKey || e.metaKey || e.altKey) return; // avoid conflicts

        const k = String(e.key || '').toLowerCase();
        if (k === KEY_VIEW) {
            e.preventDefault();
            clickCopyFor('view_');
        } else if (k === KEY_SCENE) {
            e.preventDefault();
            clickCopyFor('scene_');
        } else if (k === KEY_FIELD) {
            e.preventDefault();
            clickCopyFor('field_');
        } else if (k === KEY_OBJECT) {
            e.preventDefault();
            clickCopyFor('object_');
        }
    }

    // ==== Bind ====
    $(document).off('keydown.ktlDevPopupShortcuts');
    $(document).on('keydown.ktlDevPopupShortcuts', onKeydown);

    // ==== Flag ====
    window[FLAG_NAME] = true;
})();
`;

// Insert the code before "End of KTL"
lines.splice(endOfKtlIndex, 0, keyboardShortcutCode);

// Write back
fs.writeFileSync('KTL.js', lines.join('\n'), 'utf8');
console.log('Keyboard shortcuts added successfully (ONLY keyboard shortcuts, nothing else)');
