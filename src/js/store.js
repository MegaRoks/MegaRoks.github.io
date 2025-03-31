/**
 * Creates a store to hold the current page Y offset value.
 *
 * @param {number} initialPageYOffset - The initial vertical offset value of the page.
 * @returns {{ get: () => number, set: (newPageYOffset: number) => void }} An object with get and set methods to access and update the pageYOffset.
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
 * Creates a store to hold a list of page elements.
 *
 * @param {Element[]} initialPagesList - The initial list of page elements.
 * @returns {{ get: () => Element[], set: (newPagesList: Element[]) => void }} An object with get and set methods to access and update the pages list.
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
