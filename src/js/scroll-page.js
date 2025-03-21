const DATA_ATTRIBUTE_PAGE_ID = 'data-page-id';
const SEARCH_PARAM_PAGE = 'page';
const directionTypes = {
    UP: 'up',
    DOWN: 'down',
    STOP: 'stop'
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
 * @returns {Number}
 */
function getTargetScrollPageId(pagesList) {
    let pageId = 0;

    pagesList.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        if (elemTop >= 0 && elemBottom <= window.innerHeight) {
            const attributePageId = element.getAttribute(DATA_ATTRIBUTE_PAGE_ID);

            if (attributePageId !== null && !isNaN(Number(attributePageId))) {
                pageId = Number(attributePageId);
            }
        }
    });

    return pageId;
}

/**
 * @param deltaY {Number}
 * @returns {directionTypes}
 */
function getDirectionWheel(deltaY) {
    const delta = Math.sign(deltaY);

    const atTop = window.scrollY === 0;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

    if (atTop && delta === -1) {
        return directionTypes.STOP;
    }

    if (atBottom && delta === 1) {
        return directionTypes.STOP;
    }

    if (delta === 1) {
        return directionTypes.UP;
    }

    if (delta === -1) {
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

    const atTop = window.scrollY === 0;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;

    if (atTop || atBottom) {
        return directionTypes.STOP;
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
    if (direction === directionTypes.STOP) {
        return;
    }

    const pageId = getTargetScrollPageId(pagesList);

    const searchParams = new URLSearchParams(window.location.search);

    if (searchParams.has(SEARCH_PARAM_PAGE)) {
        pagesList[searchParams.get(SEARCH_PARAM_PAGE)].scrollIntoView(scrollConfig);
    }

    if (direction === directionTypes.UP) {
        const nextPageId = Number(pageId) + 1;

        if (nextPageId <= pagesList.length) {
            searchParams.set(SEARCH_PARAM_PAGE, nextPageId.toString());
            pagesList[nextPageId].scrollIntoView(scrollConfig);
        }
    }

    if (direction === directionTypes.DOWN) {
        const previousPageId = Number(pageId) - 1;

        if (previousPageId >= 0) {
            searchParams.set(SEARCH_PARAM_PAGE, previousPageId.toString());
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
