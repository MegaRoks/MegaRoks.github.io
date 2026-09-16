/** How long to wait for `scrollend` before assuming the scroll has settled. */
const SCROLL_END_FALLBACK_MS = 700;

/**
 * @typedef {-1 | 1} StepType
 */

/**
 * @enum {StepType}
 */
const steps = {
    backward: -1,
    forward: 1,
};

/**
 * The `KeyboardEvent.key` values handled here.
 *
 * @enum {string}
 */
const keyTypes = {
    arrowUp: 'ArrowUp',
    arrowDown: 'ArrowDown',
    pageUp: 'PageUp',
    pageDown: 'PageDown',
    home: 'Home',
    end: 'End',
    space: ' ',
};

/**
 * How many sections a key moves. Space is absent: its direction depends on Shift.
 *
 * @type {Record<string, StepType>}
 */
const stepByKey = {
    [keyTypes.arrowUp]: steps.backward,
    [keyTypes.arrowDown]: steps.forward,
    [keyTypes.pageUp]: steps.backward,
    [keyTypes.pageDown]: steps.forward,
};

/**
 * Whether the event carries a modifier that belongs to a browser shortcut.
 * Shift is deliberately absent: Shift+Space and Shift+Arrow scroll the page,
 * so they are ours to handle.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {boolean} True when the browser owns this combination.
 */
function hasBrowserShortcutModifier(event) {
    return event.altKey || event.ctrlKey || event.metaKey;
}

/**
 * Whether the spacebar would activate the focused control rather than scroll.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {boolean} True when the browser should keep the key.
 */
function activatesFocusedControl(event) {
    return event.key === keyTypes.space && Boolean(document.activeElement?.closest('a, button'));
}

/**
 * Whether the key scrolls the page and therefore has to be taken over.
 *
 * @param {string} key - The `KeyboardEvent.key` value.
 * @returns {boolean} True when the key is one this module drives.
 */
function isNavigationKey(key) {
    return key === keyTypes.home
        || key === keyTypes.end
        || key === keyTypes.space
        || stepByKey[key] !== undefined;
}

/**
 * Whether this module is responsible for the event.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {boolean} True when the event should be taken over.
 */
function isHandled(event) {
    return !event.defaultPrevented
        && !hasBrowserShortcutModifier(event)
        && !activatesFocusedControl(event)
        && isNavigationKey(event.key);
}

/**
 * Resolves which section a navigation key should land on.
 *
 * @param {KeyboardEvent} event - A keydown event this module handles.
 * @param {number} currentIndex - Index of the section in view.
 * @param {number} lastIndex - Index of the final section.
 * @returns {number} The target index, not yet clamped.
 */
function resolveTargetIndex(event, currentIndex, lastIndex) {
    if (event.key === keyTypes.home) {
        return 0;
    }

    if (event.key === keyTypes.end) {
        return lastIndex;
    }

    if (event.key === keyTypes.space) {
        return currentIndex + (event.shiftKey ? steps.backward : steps.forward);
    }

    return currentIndex + stepByKey[event.key];
}

/**
 * Finds the section occupying the middle of the viewport.
 *
 * @param {Element[]} pages - The section elements, in document order.
 * @returns {number} Index of the current section.
 */
function getCurrentIndex(pages) {
    const viewportMiddle = window.scrollY + window.innerHeight / 2;
    const index = pages.findLastIndex((page) => page.offsetTop <= viewportMiddle);

    return Math.max(index, 0);
}

/**
 * Enables section-wise keyboard navigation.
 *
 * @param {Element[]} pages - The section elements, in document order.
 * @returns {{ destroy: () => void }} Handle that detaches the listener.
 */
export function createKeyboardNavigation(pages) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    let isScrolling = false;

    /**
     * Blocks further key-driven scrolls until the current one settles.
     * Falls back to a timer where `scrollend` is unsupported.
     *
     * @returns {void}
     */
    function lockUntilScrollEnd() {
        isScrolling = true;

        let timeoutId;

        const release = () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scrollend', release);

            isScrolling = false;
        };

        timeoutId = setTimeout(release, SCROLL_END_FALLBACK_MS);

        window.addEventListener('scrollend', release);
    }

    /**
     * Scrolls a section into view, clamping the index to the existing sections.
     *
     * @param {number} index - Target section index.
     * @returns {void}
     */
    function goToPage(index) {
        const clampedIndex = Math.min(Math.max(index, 0), pages.length - 1);

        lockUntilScrollEnd();

        pages[clampedIndex].scrollIntoView({
            block: 'start',
            behavior: reducedMotion.matches ? 'auto' : 'smooth',
        });
    }

    /**
     * Moves one section, ignoring auto-repeat and keys pressed mid-scroll.
     *
     * @param {KeyboardEvent} event - A keydown event this module handles.
     * @returns {void}
     */
    function navigate(event) {
        if (event.repeat || isScrolling) {
            return;
        }

        goToPage(resolveTargetIndex(event, getCurrentIndex(pages), pages.length - 1));
    }

    /**
     * Keydown handler. Every handled key is taken over unconditionally, before
     * navigate() decides whether to act on it: a native line scroll slipping
     * through mid-animation is what strands the page between snap points.
     *
     * @param {KeyboardEvent} event - The keydown event.
     * @returns {void}
     */
    function handleKeyDown(event) {
        if (!isHandled(event)) {
            return;
        }

        event.preventDefault();

        navigate(event);
    }

    document.addEventListener('keydown', handleKeyDown);

    return {
        destroy() {
            document.removeEventListener('keydown', handleKeyDown);
        },
    };
}
