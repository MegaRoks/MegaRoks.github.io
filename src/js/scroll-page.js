import { directionTypes, scrollConfig, listenerTypes, listenerConfig, keyTypes } from './config.js';
import { createPageYOffsetStore, createPagesListStore } from './store.js';
import { scrollToElement } from './scroll.js';
import { getDirection, getElementInViewport } from './utils.js';

const pageYOffsetStore = createPageYOffsetStore(0);
const pagesListStore = createPagesListStore([]);

/**
 * Wheel event listener.
 *
 * @param {WheelEvent} event - The wheel event.
 * @returns {void}
 */
function listenerWheel(event) {
    event.preventDefault();

    const direction = getDirection(event.deltaY);
    const pagesList = pagesListStore.get();

    console.debug(`Determined direction from wheel: ${direction}.`);

    scrollToElement(
        direction,
        pagesList,
        () => detachListeners(),
        () => attachListeners(),
    );
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
    const pagesList = pagesListStore.get();

    console.debug(`Determined direction from touch: ${direction}.`);

    scrollToElement(
        direction,
        pagesList,
        () => detachListeners(),
        () => attachListeners(),
    );
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

    getElementInViewport(pagesList, (element) => {
        element.scrollIntoView(scrollConfig);
    });
}

/**
 * Keydown event listener.
 *
 * @param {KeyboardEvent} event - The keydown event.
 * @returns {void}
 */
function listenerKeyDown(event) {
    event.preventDefault();

    const pagesList = pagesListStore.get();

    if (event.key === keyTypes.arrowUp) {
        scrollToElement(
            directionTypes.up,
            pagesList,
            () => detachListeners(),
            () => attachListeners(),
        );
    }

    if (event.key === keyTypes.arrowDown) {
        scrollToElement(
            directionTypes.down,
            pagesList,
            () => detachListeners(),
            () => attachListeners(),
        );
    }
}

/**
 * Attaches all event listeners.
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
