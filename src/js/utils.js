import { directionTypes } from './config.js';

/**
 * @param deltaY {Number}
 * @returns {directionTypes}
 */
export function getDirection(deltaY) {
    const delta = Math.sign(deltaY);

    const isScrollingDown = delta === 1;
    const isScrollingUp = delta === -1;

    if (isScrollingDown) {
        return directionTypes.down;
    }

    if (isScrollingUp) {
        return directionTypes.up;
    }
}

/**
 * @param pagesList {Element[]}
 * @returns {Element | undefined}
 */
export function getElementInViewport(pagesList) {
    let bestElement = null;
    let bestIntersection = 0;

    pagesList.forEach(element => {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const totalHeight = rect.height;
        const intersectionRatio = visibleHeight / totalHeight;

        if (intersectionRatio > bestIntersection) {
            bestIntersection = intersectionRatio;
            bestElement = element;
        }
    });

    return bestElement;
}

/**
 * @param callee {Function}
 * @param timeoutMs {Number}
 * @returns {Function}
 */
export function debounce(callee, timeoutMs) {
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
