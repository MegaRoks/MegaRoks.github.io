import { directionTypes } from './config.js';

/**
 * Determines the scroll direction based on deltaY.
 *
 * @param {number} deltaY - The vertical scroll delta.
 * @returns {directionTypes} Returns directionTypes.
 */
export function getDirection(deltaY) {
    const delta = Math.sign(deltaY);

    if (delta > 0) {
        return directionTypes.down;
    }

    if (delta < 0) {
        return directionTypes.up;
    }

    return directionTypes.stop;
}

/**
 * Finds and returns the element from pagesList that has the highest visible intersection ratio with the viewport.
 *
 * @param {Element[]} pagesList - Array of page elements.
 * @returns {Element | undefined} The element with the highest intersection ratio or undefined if none is found.
 */
export function getElementInViewport(pagesList) {
    let bestElement = null;
    let bestIntersection = 0;

    pagesList.forEach(element => {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const totalHeight = rect.height;
        const intersectionRatio = totalHeight > 0 ? visibleHeight / totalHeight : 0;

        if (intersectionRatio > bestIntersection) {
            bestIntersection = intersectionRatio;
            bestElement = element;
        }
    });

    return bestElement;
}
