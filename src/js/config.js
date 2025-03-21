/**
 * @typedef {'up' | 'down'} DirectionType
 */

/**
 * @enum {DirectionType}
 */
export const directionTypes = {
    UP: 'up',
    DOWN: 'down',
};

/** @type {ScrollIntoViewOptions} */
export const scrollConfig = {
    block: 'center',
    behavior: 'smooth',
};


/**
 * @typedef {Object} ListenerTypes
 * @property {keyof HTMLElementEventMap} wheel
 * @property {keyof HTMLElementEventMap} touchstart
 * @property {keyof HTMLElementEventMap} touchend
 * @property {keyof HTMLElementEventMap} resize
 */

/** @type {ListenerTypes} */
export const listenerTypes = {
    wheel: 'wheel',
    touchstart: 'touchstart',
    touchend: 'touchend',
    resize: 'resize',
};

/**
 * @typedef {Object} ListenerConfig
 * @property {boolean} passive
 */

/** @type {ListenerConfig} */
export const listenerConfig = {
    passive: false,
};