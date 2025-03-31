import { directionTypes, scrollConfig, listenerTypes, listenerConfig, keyTypes } from './config.js';
import { createPageYOffsetStore, createPagesListStore } from './store.js';
import { getDirection, getElementInViewport } from './utils.js';

const pageYOffsetStore = createPageYOffsetStore(0);
const pagesListStore = createPagesListStore([]);

/**
 * Smoothly scrolls an element into view and calls the callback when the element is fully visible.
 *
 * @param {Element} element - The element to scroll into view.
 * @param {ScrollIntoViewOptions} config - Options for scrollIntoView.
 * @param {(elapsedTime: number) => void} callback - Callback function called when scrolling finishes. Receives elapsed time (ms).
 * @returns {void}
 */
function scrollIntoViewWithCallback(element, config, callback) {
    const startTime = performance.now();

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
                const endTime = performance.now();
                const elapsedTime = endTime - startTime;

                obs.disconnect();
                callback(elapsedTime);
            }
        });
    }, { threshold: 1.0 });

    observer.observe(element);
    element.scrollIntoView(config);
}

/**
 * Initiates scrolling to the target element based on the specified direction.
 * Detaches event listeners before scrolling, then reattaches them after the scroll finishes.
 *
 * @param {directionTypes} direction - The scrolling direction.
 * @param {Element} element - The target element to scroll into view.
 * @returns {void}
 */
function scroll(direction, element) {
    detachListeners();

    scrollIntoViewWithCallback(element, scrollConfig, (elapsedTime) => {
        console.debug(`Scroll ${direction} finished in ${elapsedTime.toFixed(2)} ms.`);

        setTimeout(()=> {
            attachListeners();
        }, elapsedTime);
    });
}

/**
 * Determines and scrolls to the next or previous element based on the scrolling direction.
 *
 * @param {directionTypes} direction - The scrolling direction.
 * @returns {void}
 */
function scrollToElement(direction) {
    console.debug(`scrollToElement invoked with direction: ${direction}.`);

    if (direction === directionTypes.stop) {
        console.debug('Scrolling stopped.');

        return;
    }

    const pagesList = pagesListStore.get();
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        console.debug('No element in viewport found.');

        return;
    }

    const pageId = pagesList.indexOf(elementInViewport);

    console.debug(`Current page index: ${pageId}.`);

    if (direction === directionTypes.up) {
        const nextPageId = pageId - 1;

        if (nextPageId > -1) {
            console.debug(`Next page index for UP: ${nextPageId}.`);

            scroll(direction, pagesList[nextPageId]);
        }
    }

    if (direction === directionTypes.down) {
        const previousPageId = pageId + 1;

        if (previousPageId < pagesList.length) {
            console.debug(`Next page index for DOWN: ${previousPageId}.`);

            scroll(direction, pagesList[previousPageId]);
        }
    }
}

/**
 * Wheel event listener.
 *
 * @param {WheelEvent} event - The wheel event.
 * @returns {void}
 */
function listenerWheel(event) {
    event.preventDefault();

    const direction = getDirection(event.deltaY);

    console.debug(`Determined direction from wheel: ${direction}.`);

    scrollToElement(direction);
}

/**
 * Touch start event listener.
 *
 * @param {TouchEvent} event - The touchstart event.
 * @returns {void}
 */
function listenerTouchStart(event) {
    event.preventDefault();

    pageYOffsetStore.set(event.touches[0].clientY);
}

/**
 * Touch end event listener.
 *
 * @param {TouchEvent} event - The touchend event.
 * @returns {void}
 */
function listenerTouchFinish(event) {
    event.preventDefault();

    const pageYOffset = pageYOffsetStore.get();
    const deltaY = pageYOffset - event.changedTouches[0].clientY;
    const direction = getDirection(deltaY);

    console.debug(`Determined direction from touch: ${direction}.`);

    scrollToElement(direction);
}

/**
 * Resize event listener.
 *
 * @param {UIEvent} event - The resize event.
 * @returns {void}
 */
function listenerResize(event) {
    event.preventDefault();

    const pagesList = pagesListStore.get();
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        console.debug('No element in viewport found.');

        return;
    }

    elementInViewport.scrollIntoView(scrollConfig);
}

/**
 * Keydown event listener.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
function listenerKeyDown(event) {
    event.preventDefault();

    console.debug(`Keydown event: ${event.key}.`);

    if (event.key === keyTypes.arrowUp) {
        scrollToElement(directionTypes.up);
    }

    if (event.key === keyTypes.arrowDown) {
        scrollToElement(directionTypes.down);
    }
}

/**
 * Attaches all event listeners using the given configuration.
 *
 * @returns {void}
 */
function attachListeners() {
    console.debug('Attaching listeners.');

    window.addEventListener(listenerTypes.wheel, listenerWheel, listenerConfig);
    window.addEventListener(listenerTypes.touchstart, listenerTouchStart, listenerConfig);
    window.addEventListener(listenerTypes.touchend, listenerTouchFinish, listenerConfig);
    window.addEventListener(listenerTypes.keydown, listenerKeyDown, listenerConfig);
    window.addEventListener(listenerTypes.resize, listenerResize, listenerConfig);
}

/**
 * Detaches all event listeners.
 *
 * @returns {void}
 */
function detachListeners() {
    console.debug('Detaching listeners.');

    window.removeEventListener(listenerTypes.wheel, listenerWheel, listenerConfig);
    window.removeEventListener(listenerTypes.touchstart, listenerTouchStart, listenerConfig);
    window.removeEventListener(listenerTypes.touchend, listenerTouchFinish, listenerConfig);
    window.removeEventListener(listenerTypes.keydown, listenerKeyDown, listenerConfig);
    window.removeEventListener(listenerTypes.resize, listenerResize, listenerConfig);
}

/**
 * Initializes the scroll page functionality by setting the pages list and attaching listeners.
 *
 * @param {Element[]} pagesList - Array of page elements.
 * @returns {void}
 */
export function scrollPage(pagesList) {
    console.debug('Initializing scrollPage.');

    pagesListStore.set(pagesList);

    attachListeners();
}
