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
 * Observes a list of elements to determine which one has the highest visibility within the viewport.
 * Once the element with the greatest intersection ratio is determined, the callback is invoked with that element,
 * and the observer disconnects.
 *
 * @param {Element[]} pagesList - An array of DOM elements to observe.
 * @param {(element: Element|null) => void} callback - A callback function that receives the element with the highest visibility.
 * @returns {void}
 */
export function getElementInViewport(pagesList, callback) {
    let element = null;
    let intersection = 0;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.intersectionRatio > intersection) {
                intersection = entry.intersectionRatio;
                element = entry.target;
            }
        });

        callback(element);
        observer.disconnect();
    }, {
        threshold: [0, 0.25, 0.5, 0.75, 1.0]
    });

    pagesList.forEach(element => observer.observe(element));
}

/**
 * Creates a performance tracker utility.
 *
 * This function records the start time when invoked and returns an "end" function.
 * When you call the returned function, it calculates the elapsed time and invokes
 * the provided callback with the elapsed time (in milliseconds).
 *
 * @param {Function} callback - A function to be called with the elapsed time.
 * @returns {() => void} A function that, when invoked, calculates the elapsed time and calls the callback.
 */
export function createPerformanceTracker(callback) {
    const startTime = performance.now();

    return () => {
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;

        callback(elapsedTime);
    };
}
