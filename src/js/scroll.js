import { directionTypes, scrollConfig } from './config.js';
import { getElementInViewport, createPerformanceTracker } from './utils.js';

/**
 * Determines the target index for scrolling based on the current index, direction, and pages list.
 *
 * @param {number} currentIndex - The index of the currently visible element.
 * @param {directionTypes} direction - The scrolling direction (e.g. up, down, or stop).
 * @param {Element[]} pagesList - An array of page elements.
 * @returns {number} The target index to scroll to, or -1 if no valid target exists.
 */
function determineTargetIndex(currentIndex, direction, pagesList) {
    if (direction === directionTypes.up) {
        const targetIndex = currentIndex - 1;
        return targetIndex > -1 ? targetIndex : -1;
    }

    if (direction === directionTypes.down) {
        const targetIndex = currentIndex + 1;
        return targetIndex < pagesList.length ? targetIndex : -1;
    }

    return -1;
}

/**
 * Smoothly scrolls an element into view and calls the callback when the element is fully visible.
 *
 * @param {Element} element - The element to scroll into view.
 * @param {() => void} callback - Callback function called when scrolling finishes. Receives elapsed time (ms).
 * @returns {void}
 */
function scrollIntoView(element, callback) {
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
                obs.disconnect();
                callback();
            }
        });
    }, { threshold: 1.0 });

    observer.observe(element);
    element.scrollIntoView(scrollConfig);
}

/**
 * Smoothly scrolls to an element based on the given direction, tracking performance and triggering callbacks before and after the scroll.
 *
 * This function executes the beforeScroll callback, then sets up a performance tracker. If the direction is 'stop',
 * it halts scrolling immediately. Otherwise, it determines the currently visible element, computes the target index
 * using determineTargetIndex, and if a valid target exists, scrolls the corresponding element into view. After scrolling,
 * the performance tracker logs the elapsed time and the afterScroll callback is executed.
 *
 * @param {directionTypes} direction - The scrolling direction (e.g. up, down, or stop).
 * @param {Element[]} pagesList - An array of page elements.
 * @param {() => void} beforeScroll - Callback function to be executed before starting the scroll.
 * @param {() => void} afterScroll - Callback function to be executed after the scroll finishes.
 * @returns {void}
 */
export function scrollToElement(direction, pagesList, beforeScroll, afterScroll,) {
    beforeScroll();

    const scrollTracking = createPerformanceTracker((elapsedTime) => {
        console.debug(`Scroll ${direction} finished in ${elapsedTime.toFixed(2)} ms.`);

        setTimeout(afterScroll, elapsedTime);
    });

    if (direction === directionTypes.stop) {
        console.debug('Scrolling stopped.');

        scrollTracking();
    } else {
        console.debug('Scrolling start.');

        getElementInViewport(pagesList, (element) => {
            const currentIndex = pagesList.indexOf(element);

            console.debug(`Current index: ${currentIndex}.`);

            const targetIndex = determineTargetIndex(currentIndex, direction, pagesList);

            if (targetIndex !== -1) {
                console.debug(`Next page index for ${direction}: ${targetIndex}.`);

                scrollIntoView(pagesList[targetIndex], () => {
                    scrollTracking();
                });
            } else {
                scrollTracking();
            }
        });
    }
}
