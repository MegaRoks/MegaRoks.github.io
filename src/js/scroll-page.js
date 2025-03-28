import { directionTypes, scrollConfig, listenerTypes, listenerConfig, keyTypes } from './config.js';
import { createPageYOffsetStore, createPagesListStore } from './store.js';
import {debounce, getDirection, getElementInViewport} from './utils.js';

const pageYOffsetStore = createPageYOffsetStore(0);
const pagesListStore = createPagesListStore([]);

/**
 * @param {directionTypes} direction
 * @returns {void}
 */
function scroll(direction) {
    const pagesList = pagesListStore.get();
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        return
    }

    const pageId = pagesList.indexOf(elementInViewport);

    if (direction === directionTypes.up) {
        const nextPageId = pageId - 1;

        if (nextPageId > - 1) {
            pagesList[nextPageId].scrollIntoView(scrollConfig);
        }
    }

    if (direction === directionTypes.down) {
        const previousPageId = pageId + 1;

        if (previousPageId < pagesList.length) {
            pagesList[previousPageId].scrollIntoView(scrollConfig);
        }
    }
}

/**
 * @param {WheelEvent} event
 * @returns {void}
 */
function listenerWheel(event) {
    const direction = getDirection(event.deltaY);

    scroll(direction);
}

/**
 * @param {TouchEvent} event
 * @returns {void}
 */
function listenerTouchStart(event) {
    event.preventDefault();

    pageYOffsetStore.set(event.touches[0].clientY);
}

/**
 * @param {TouchEvent} event
 * @returns {void}
 */
function listenerTouchFinish(event) {
    event.preventDefault();

    const pageYOffset = pageYOffsetStore.get();
    const deltaY = pageYOffset - event.changedTouches[0].clientY;
    const direction = getDirection(deltaY);

    scroll(direction);
}

/**
 * @param {UIEvent} event
 * @returns {void}
 */
function listenerResize(event) {
    const pagesList = pagesListStore.get();
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        return
    }

    elementInViewport.scrollIntoView(scrollConfig);
}

/**
 * @param {KeyboardEvent} event
 * @returns {void}
 */
function listenerKeyDown(event) {
    if (event.key === keyTypes.arrowDown) {
        scroll(directionTypes.up);
    }

    if (event.key === keyTypes.arrowUp) {
        scroll(directionTypes.down);
    }
}

/**
 * @param {Element[]} pagesList
 * @returns {void}
 */
export function scrollPage(pagesList) {
    pagesListStore.set(pagesList);

    const debounceListenerWheel = debounce(listenerWheel, 50);

    window.addEventListener(listenerTypes.wheel, debounceListenerWheel, listenerConfig);
    window.addEventListener(listenerTypes.touchstart, listenerTouchStart, listenerConfig);
    window.addEventListener(listenerTypes.touchend, listenerTouchFinish, listenerConfig);
    window.addEventListener(listenerTypes.keydown, listenerKeyDown, listenerConfig);
    window.addEventListener(listenerTypes.resize, listenerResize, listenerConfig);
}
