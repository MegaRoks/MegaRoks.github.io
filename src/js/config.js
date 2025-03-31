/**
 * @typedef {'up' | 'down' | 'stop'} DirectionType
 */

/**
 * @enum {DirectionType}
 */
export const directionTypes = {
    up: 'up',
    down: 'down',
    stop: 'stop'
};

/** @type {ScrollIntoViewOptions} */
export const scrollConfig = {
    block: 'center',
    behavior: 'smooth',
};


/**
 * @typedef {Object} ListenerTypes
 * @property {keyof WindowEventMap} wheel
 * @property {keyof WindowEventMap} touchstart
 * @property {keyof WindowEventMap} touchend
 * @property {keyof WindowEventMap} keydown
 * @property {keyof WindowEventMap} resize
 */

/** @type {ListenerTypes} */
export const listenerTypes = {
    wheel: 'wheel',
    touchstart: 'touchstart',
    touchend: 'touchend',
    keydown: 'keydown',
    resize: 'resize',
};

/** @type {AddEventListenerOptions} */
export const listenerConfig = {
    passive: false,
    once: false,
};

/**
 * @typedef {Object} KeyTypes
 * @property {string} arrowUp
 * @property {string} arrowDown
 */

/** @type {KeyTypes} */
export const keyTypes = {
    arrowUp: 'ArrowUp',
    arrowDown: 'ArrowDown',
}
