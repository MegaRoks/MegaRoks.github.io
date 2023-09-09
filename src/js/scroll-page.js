class ScrollPage {
    #container;
    #targetScrollPage;
    #scrollPagesList;

    #scrollConfig = {
        block: "center",
        behavior: "smooth"
    }

    #touchStartY
    #listenerOptions = {
        passive: false
    }
    #scrollTypes = {
        WHEEL: 'wheel',
        TOUCHSTART: 'touchstart',
        TOUCHED: 'touchend',
    }

    #direction;
    #directionConfig = {
        UP: "up",
        DOWN: "down"
    }

    constructor(container, scrollPagesList) {
        this.#scrollPagesList = scrollPagesList;
        this.#container = container;
        this.#isScrolledIntoView(scrollPagesList);
    }

    #isScrolledIntoView(scrollPagesList) {
        scrollPagesList.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom;

            if ((elemTop >= 0) && (elemBottom <= window.innerHeight)) {
                this.#targetScrollPage = element.getAttributeNode('id').value;
            }
        })

    }

    #getDirectionWheel(deltaY) {
        const delta = Math.sign(deltaY);

        if (delta === 1) {
            this.#direction = this.#directionConfig.UP;
        } else if (delta === -1) {
            this.#direction = this.#directionConfig.DOWN;
        }
    }

    #getDirectionTouch(finishTouchCoordinatesY) {
        if (finishTouchCoordinatesY < this.#touchStartY - 5) {
            this.#direction = this.#directionConfig.UP;
        } else if (finishTouchCoordinatesY > this.#touchStartY + 5) {
            this.#direction = this.#directionConfig.DOWN;
        }
    }

    // TODO refactor
    #scrolled() {
        if (this.#direction === 'up') {
            if (this.#targetScrollPage === 'scroll-page-1') {
                this.#scrollPagesList[1].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[1].getAttributeNode('id').value;
            } else if (this.#targetScrollPage === 'scroll-page-2') {
                this.#scrollPagesList[2].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[2].getAttributeNode('id').value;
            }
        } else {
            if (this.#targetScrollPage === 'scroll-page-3') {
                this.#scrollPagesList[1].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[1].getAttributeNode('id').value;
            } else if (this.#targetScrollPage === 'scroll-page-2') {
                this.#scrollPagesList[0].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[0].getAttributeNode('id').value;
            }
        }
    }

    #listenerWheel(event) {
        event.preventDefault();
        this.#getDirectionWheel(event.deltaY);
        this.#scrolled();
    }

    #listenerTouchStart(event) {
        event.preventDefault()
        this.#touchStartY = event.touches[0].clientY;
    }

    #listenerTouchFinish(event) {
        event.preventDefault();
        this.#getDirectionTouch(event.changedTouches[0].clientY);
        this.#scrolled();
    }

    init() {
        this.#container.addEventListener(
            this.#scrollTypes.WHEEL,
            (event) => this.#listenerWheel(event),
            this.#listenerOptions,
        );
        this.#container.addEventListener(
            this.#scrollTypes.TOUCHSTART,
            (event) => this.#listenerTouchStart(event),
            this.#listenerOptions,
        );
        this.#container.addEventListener(
            this.#scrollTypes.TOUCHED,
            (event) => this.#listenerTouchFinish(event),
            this.#listenerOptions,
        );
    }
}