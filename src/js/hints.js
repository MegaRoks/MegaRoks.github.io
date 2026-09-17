/**
 * Navigation for the chevrons between sections.
 *
 * They stay plain anchors so the page works with no JavaScript, but a plain
 * anchor pushes a history entry on every click, which turns the back button
 * into a way of walking back up the page rather than leaving it. Handling the
 * click here scrolls to the same place and replaces the current entry instead,
 * so the address still names the section and the history stays as it was.
 */

/**
 * Whether the browser should be left to handle the click itself, as it would
 * for a middle click or a modified one that opens a new tab.
 *
 * @param {MouseEvent} event - The click event.
 * @returns {boolean} True when the click is not ours to take over.
 */
function isBrowserClick(event) {
    return event.defaultPrevented
        || event.button !== 0
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || event.shiftKey;
}

/**
 * Takes over the chevrons so they scroll without growing the history.
 *
 * @param {Element[]} hints - The chevron anchors.
 * @returns {{ destroy: () => void }} Handle that detaches the listeners.
 */
export function createHintNavigation(hints) {
    /**
     * Click handler.
     *
     * @param {MouseEvent} event - The click event.
     * @returns {void}
     */
    function handleClick(event) {
        if (isBrowserClick(event)) {
            return;
        }

        const hash = event.currentTarget.getAttribute('href');
        const target = document.querySelector(hash);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({ block: 'start' });
        history.replaceState(null, '', hash);
    }

    hints.forEach((hint) => hint.addEventListener('click', handleClick));

    return {
        destroy() {
            hints.forEach((hint) => hint.removeEventListener('click', handleClick));
        },
    };
}
