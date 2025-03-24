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

/**
 * @typedef {Object} ListenerConfig
 * @property {boolean} passive
 */

/** @type {ListenerConfig} */
export const listenerConfig = {
    passive: false,
};