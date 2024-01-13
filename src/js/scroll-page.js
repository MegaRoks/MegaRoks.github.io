const DATA_ATTRIBUTE = 'data-page-id';
const directionTypes = {
    UP: "up",
    DOWN: "down",
}
let touchStartY = 0;

function isScrolledIntoView (scrollPagesList) {
    return scrollPagesList.find((element) => {
        const rect = element.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        if ((elemTop >= 0) && (elemBottom <= window.innerHeight)) {
            return element;
        }
    });
}

function getDirectionWheel(deltaY) {
    const delta = Math.sign(deltaY);

    if (delta === 1) {
        return directionTypes.UP;
    } else if (delta === -1) {
        return  directionTypes.DOWN;
    }
}

function getDirectionTouch(finishTouchCoordinatesY) {
    if (finishTouchCoordinatesY < touchStartY - 5) {
        return directionTypes.UP;
    } else if (finishTouchCoordinatesY > touchStartY + 5) {
        return directionTypes.DOWN;
    }
}

function scroll(direction, scrollPagesList) {
    const targetScrollPage = isScrolledIntoView(scrollPagesList);

    if (!targetScrollPage) {
        return;
    }

    const pageId = targetScrollPage.getAttribute(DATA_ATTRIBUTE);
    const scrollConfig = {
        block: "center",
        behavior: "smooth",
    }

    if (direction === directionTypes.UP) {
        const nextPageId = Number(pageId) + 1;

        if (nextPageId < scrollPagesList.length) {
            scrollPagesList[nextPageId].scrollIntoView(scrollConfig);
        }
    }

    if (direction === directionTypes.DOWN) {
        const previousPageId = Number(pageId) - 1;

        if (previousPageId >= 0) {
            scrollPagesList[previousPageId].scrollIntoView(scrollConfig);
        }
    }
}

function listenerWheel(event, scrollPagesList) {
    event.preventDefault();
    scroll(getDirectionWheel(event.deltaY), scrollPagesList);
}

function listenerTouchStart (event) {
    event.preventDefault();
    touchStartY = event.touches[0].clientY;
}

function listenerTouchFinish (event, pagesList) {
    event.preventDefault();
    scroll(getDirectionTouch(event.changedTouches[0].clientY), pagesList);
}

function scrollPage(container, pages) {
    const pagesList = Array.from(pages);
    pagesList.map((element, index) => {
        element.setAttribute(DATA_ATTRIBUTE, index)
    });

    const listenerConfig = {
        types: {
            WHEEL: "wheel",
            TOUCHSTART: "touchstart",
            TOUCHED: "touchend",
        },
        options: {
            passive: false
        }
    };
    container.addEventListener(
        listenerConfig.types.WHEEL,
        (event) => listenerWheel(event, pagesList),
        listenerConfig.options,
    );
    container.addEventListener(
        listenerConfig.types.TOUCHSTART,
        (event) => listenerTouchStart(event),
        listenerConfig.options,
    );
    container.addEventListener(
        listenerConfig.types.TOUCHED,
        (event) => listenerTouchFinish(event, pagesList),
        listenerConfig.options,
    );
}
