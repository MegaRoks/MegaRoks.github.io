const DATA_ATTRIBUTE = 'data-page-id';
const directionTypes = {
    UP: 'up',
    DOWN: 'down',
};
const scrollConfig = { block: 'center', behavior: 'smooth' };
const listenerConfig = {
    types: {
        WHEEL: 'wheel',
        TOUCHSTART: 'touchstart',
        TOUCHEND: 'touchend',
        RESIZE: 'resize',
    },
    options: {
        passive: false,
    },
};

/**
 * @param pagesList {Element[]}
 * @returns {Element || undefined}
 */
function isScrolledIntoView(pagesList) {
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
 * @param deltaY {Number}
 * @returns {directionTypes}
 */
function getDirectionWheel(deltaY) {
    const delta = Math.sign(deltaY);

    if (delta === 1) {
        return directionTypes.UP;
    } else if (delta === -1) {
        return directionTypes.DOWN;
    }
}

/**
 * @param lastTouchY {Number}
 * @returns {directionTypes || undefined}
 */
function getDirectionTouch(lastTouchY) {
    const startTouchY = this.lastTouchY;

    if (!startTouchY) {
        this.lastTouchY = lastTouchY;

        return undefined;
    }

    if (lastTouchY < startTouchY - 5) {
        return directionTypes.UP;
    } else if (lastTouchY > startTouchY + 5) {
        return directionTypes.DOWN;
    }
}

/**
 * @param direction {directionTypes}
 * @param pagesList {Element[]}
 * @returns {void}
 */
function scroll(direction, pagesList) {
    const targetScrollPage = isScrolledIntoView(pagesList);

    if (!targetScrollPage) {
        return;
    }

    const pageId = targetScrollPage.getAttribute(DATA_ATTRIBUTE);

    if (direction === directionTypes.UP) {
        const nextPageId = Number(pageId) + 1;

        if (nextPageId < pagesList.length) {
            pagesList[nextPageId].scrollIntoView(scrollConfig);
        }
    }

    if (direction === directionTypes.DOWN) {
        const previousPageId = Number(pageId) - 1;

        if (previousPageId >= 0) {
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
        element.setAttribute(DATA_ATTRIBUTE, index.toString());
    });

    const debouncedWheel = debounce(listenerWheel, 50);

    container.addEventListener(
        listenerConfig.types.WHEEL,
        (event) => debouncedWheel(event, pagesList),
        listenerConfig.options,
    );
    container.addEventListener(
        listenerConfig.types.TOUCHSTART,
        (event) => listenerTouchStart(event),
        listenerConfig.options,
    );
    container.addEventListener(
        listenerConfig.types.TOUCHEND,
        (event) => listenerTouchFinish(event, pagesList),
        listenerConfig.options,
    );
    window.addEventListener(
        listenerConfig.types.RESIZE,
        (event) => listenerResize(event, pagesList),
        listenerConfig.options,
    );
}
