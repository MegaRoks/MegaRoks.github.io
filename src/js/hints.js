/**
 * Navigation for the chevrons between sections.
 *
 * They stay plain anchors so the page works with no JavaScript, but following
 * one writes its fragment into the address bar and pushes a history entry,
 * which leaves the visitor with a URL they did not ask for and a back button
 * that walks back up the page rather than leaving it. Handling the click here
 * scrolls to the same section and touches neither.
 *
 * A fragment typed or pasted by hand still works: the browser resolves it on
 * load without going through any of this.
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
 * Takes over the chevrons so they scroll without changing the address.
 *
 * @param {Element[]} hints - The chevron anchors.
 * @returns {{ destroy: () => void }} Handle that detaches the listeners.
 */
export function createHintNavigation(hints) {
    /**
     * Click handler. Scrolls without recording anything.
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
    }

    hints.forEach((hint) => hint.addEventListener('click', handleClick));

    return {
        destroy() {
            hints.forEach((hint) => hint.removeEventListener('click', handleClick));
        },
    };
}
