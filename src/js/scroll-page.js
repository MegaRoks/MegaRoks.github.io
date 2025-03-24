import { directionTypes, scrollConfig,listenerTypes, listenerConfig } from './config.js';
import { DATA_ATTRIBUTE_PAGE_ID } from './constants.js';

/**
 * @param pagesList {Element[]}
 * @returns {Element | undefined}
 */
function getElementInViewport(pagesList) {
    return pagesList.find((element) => {
        const rect = element.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        if (elemTop >= 0 && elemBottom <= window.innerHeight) {
            return element;
        }
    });
}

/**
 * @param lastDeltaY {Number}
 * @returns {directionTypes}
 */
function getDirectionWheel(lastDeltaY) {
    const delta = Math.sign(lastDeltaY);

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
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        return
    }

    const pageId = Number(elementInViewport.getAttribute(DATA_ATTRIBUTE_PAGE_ID)) || 0;

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
    event.preventDefault();
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
 * @param event {UIEvent}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function listenerResize(event, pagesList) {
    const elementInViewport = getElementInViewport(pagesList);

    if (!elementInViewport) {
        return
    }

    elementInViewport.scrollIntoView(scrollConfig);
}

/**
 * @param event {KeyboardEvent}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function listenerKeyDown(event, pagesList) {
    if (event.key === 'ArrowDown') {
        scroll(directionTypes.UP, pagesList);
    } else if (event.key === 'ArrowUp') {
        scroll(directionTypes.DOWN, pagesList);
    }
}

/**
 * @param pages {HTMLCollection}
 * @returns {void}
 */
export function scrollPage(pages) {
    const pagesList = Array.from(pages);

    pagesList.map((element, index) => {
        element.setAttribute(DATA_ATTRIBUTE_PAGE_ID, index.toString());
    });

    const debouncedWheel = debounce(listenerWheel, 50);


    window.addEventListener(
        listenerTypes.wheel,
        (event) => debouncedWheel(event, pagesList),
        listenerConfig,
    );
    window.addEventListener(
        listenerTypes.touchstart,
        (event) => listenerTouchStart(event),
        listenerConfig,
    );
    window.addEventListener(
        listenerTypes.touchend,
        (event) => listenerTouchFinish(event, pagesList),
        listenerConfig,
    );
    window.addEventListener(
        listenerTypes.keydown,
        (event) => listenerKeyDown(event, pagesList),
        listenerConfig,
    );
    window.addEventListener(
        listenerTypes.resize,
        (event) => listenerResize(event, pagesList),
        listenerConfig,
    );
}
