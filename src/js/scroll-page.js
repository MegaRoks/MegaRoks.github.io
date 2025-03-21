import { directionTypes, scrollConfig,listenerTypes, listenerConfig } from './config.js';
import { DATA_ATTRIBUTE_PAGE_ID } from './constants.js';

/**
 * @param pagesList {Element[]}
 * @returns {Number}
 */
function getTargetScrollPageId(pagesList) {
    const element = pagesList.find((element) => {
        const rect = element.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        if (elemTop >= 0 && elemBottom <= window.innerHeight) {
            return element;
        }
    });

    return Number(element.getAttribute(DATA_ATTRIBUTE_PAGE_ID)) || 0;
}

/**
 * @param deltaY {Number}
 * @returns {directionTypes}
 */
function getDirectionWheel(deltaY) {
    const delta = Math.sign(deltaY);

    const isScrollingDown = delta === 1;
    const isScrollingUp = delta === -1;

    if (isScrollingDown) {
        return directionTypes.UP;
    }

    if (isScrollingUp) {
        return directionTypes.DOWN;
    }
}

/**
 * @param lastTouchY {Number}
 * @returns {directionTypes}
 */
function getDirectionTouch(lastTouchY) {
    const startTouchY = this.lastTouchY;

    if (startTouchY === undefined) {
        this.lastTouchY = lastTouchY;
        return undefined;
    }

    const isSwipingUp = lastTouchY < startTouchY - 5;
    const isSwipingDown = lastTouchY > startTouchY + 5;

    this.lastTouchY = lastTouchY;

    if (isSwipingUp) {
       return  directionTypes.UP;
    }

    if (isSwipingDown) {
        return  directionTypes.DOWN;
    }
}

/**
 * @param direction {directionTypes}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function scroll(direction, pagesList) {
    const pageId = getTargetScrollPageId(pagesList);

    if (direction === directionTypes.UP) {
        const nextPageId = Number(pageId) + 1;

        if (nextPageId < pagesList.length) {
            pagesList[nextPageId].scrollIntoView(scrollConfig);
        }
    }

    if (direction === directionTypes.DOWN) {
        const previousPageId = Number(pageId) - 1;

        if (previousPageId > -1) {
            pagesList[previousPageId].scrollIntoView(scrollConfig);
        }
    }
}

/**
 * @param callee {Function}
 * @param timeoutMs {Number}
 * @returns {Function}
 */
function debounce(callee, timeoutMs) {
    let lastCall = 0;
    let isFirstCall = false;
    let lastCallTimer;

    return function (...args) {
        const previousCall = lastCall;
        lastCall = Date.now();

        if (!isFirstCall) {
            callee(...args);
        }

        if (previousCall && lastCall - previousCall <= timeoutMs) {
            isFirstCall = true;
            clearTimeout(lastCallTimer);
        }

        lastCallTimer = setTimeout(() => {
            isFirstCall = false;
        }, timeoutMs);
    };
}

/**
 * @param event {WheelEvent}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function listenerWheel(event, pagesList) {
    event.preventDefault();
    scroll(getDirectionWheel(event.deltaY), pagesList);
}

/**
 * @param event {TouchEvent}
 * @returns {void}
 */
function listenerTouchStart(event) {
    getDirectionTouch(event.touches[0].clientY);
}

/**
 * @param event {TouchEvent}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function listenerTouchFinish(event, pagesList) {
    event.preventDefault();
    scroll(getDirectionTouch(event.changedTouches[0].clientY), pagesList);
}

/**
 * @param event {Event}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function listenerResize(event, pagesList) {
    pagesList[0].scrollIntoView(scrollConfig);
}

/**
 * @param container {HTMLElement}
 * @param pages {HTMLCollection}
 * @returns {void}
 */
export function scrollPage(container, pages) {
    const pagesList = Array.from(pages);

    pagesList.map((element, index) => {
        element.setAttribute(DATA_ATTRIBUTE_PAGE_ID, index.toString());
    });

    const debouncedWheel = debounce(listenerWheel, 50);

    container.addEventListener(
        listenerTypes.wheel,
        (event) => debouncedWheel(event, pagesList),
        listenerConfig,
    );
    container.addEventListener(
        listenerTypes.touchstart,
        (event) => listenerTouchStart(event),
        listenerConfig,
    );
    container.addEventListener(
        listenerTypes.touchend,
        (event) => listenerTouchFinish(event, pagesList),
        listenerConfig,
    );
    window.addEventListener(
        listenerTypes.resize,
        (event) => listenerResize(event, pagesList),
        listenerConfig,
    );
}
