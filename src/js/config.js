/**
 * @typedef {'up' | 'down' | 'stop'} DirectionType
 */

/**
 * @enum {DirectionType}
 */
export const directionTypes = {
    UP: 'up',
    DOWN: 'down',
    STOP: 'stop'
};

/** @type {ScrollIntoViewOptions} */
export const scrollConfig = {
    block: 'center',
    behavior: 'smooth',
};


/** @type {keyof HTMLElementEventMap} */
export const listenerTypes = {
    wheel: 'wheel',
    touchstart: 'touchstart',
    touchend: 'touchend',
    resize: 'resize',
};

/** @type {AddEventListenerOptions} */
export const listenerConfig = {
    passive: false,
    capture: true,
    once: false,
};