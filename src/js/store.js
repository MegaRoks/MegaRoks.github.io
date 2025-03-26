/**
 * @param {number} initialPageYOffset - Initial page Y offset value.
 * @returns {{ get: () => number, set: (newPageYOffset: number) => void }} - Object with get and set methods.
 */
export function createPageYOffsetStore(initialPageYOffset) {
    let pageYOffset = initialPageYOffset;

    return {
        get() {
            return pageYOffset;
        },
        set(newPageYOffset) {
            pageYOffset = newPageYOffset;
        },
    };
}

/**
 * @param {Element[]} initialPagesList - Initial pages list  .
 * @returns {{ get: () => Element[], set: (newPageYOffset: Element[]) => void }} - Object with get and set methods.
 */
export function createPagesListStore(initialPagesList) {
    let pagesList = initialPagesList;

    return {
        get() {
            return pagesList;
        },
        set(newPagesList) {
            pagesList = newPagesList;
        },
    };
}