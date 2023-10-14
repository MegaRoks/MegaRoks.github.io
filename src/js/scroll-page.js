class ScrollPage {
    #container;
    #targetScrollPage;
    #scrollPagesList;

    #scrollConfig = {
        block: "center",
        behavior: "smooth",
    }
    #scroled = false;

    #touchStartY;
    #listenerOptions = {
        passive: false
    }
    #listenerTypes = {
        WHEEL: "wheel",
        TOUCHSTART: "touchstart",
        TOUCHED: "touchend",
    }

    #direction;
    #directionConfig = {
        UP: "up",
        DOWN: "down",
    }


    constructor(container, scrollPagesList) {
        this.#scrollPagesList = scrollPagesList;
        this.#container = container;
        this.#isScrolledIntoView(scrollPagesList);
        this.#init();
    }

    #debounce() {
        setTimeout(() => this.#scroled = false, 200);
    }

    #isScrolledIntoView(scrollPagesList) {
        scrollPagesList.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom;

            if ((elemTop >= 0) && (elemBottom <= window.innerHeight)) {
                this.#targetScrollPage = element.getAttributeNode("id").value;
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
        if(Boolean(this.#scroled)) {
            return;
        }

        if (this.#direction === "up") {
            if (this.#targetScrollPage === "scroll-page-1") {
                this.#scrollPagesList[1].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[1].getAttributeNode('id').value;
                this.#scroled = true;
                this.#debounce();
            } else if (this.#targetScrollPage === "scroll-page-2") {
                this.#scrollPagesList[2].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[2].getAttributeNode('id').value;
                this.#scroled = true;
                this.#debounce();
            } else {
                this.#scroled = false;
            }
        }

        if (this.#direction === "down") {
            if (this.#targetScrollPage === "scroll-page-3") {
                this.#scrollPagesList[1].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[1].getAttributeNode('id').value;
                 this.#scroled = true;
                 this.#debounce();
            } else if (this.#targetScrollPage === "scroll-page-2") {
                this.#scrollPagesList[0].scrollIntoView(this.#scrollConfig);
                this.#targetScrollPage = this.#scrollPagesList[0].getAttributeNode('id').value;
                this.#scroled = true;
                this.#debounce();
            } else {
                this.#scroled = false;
            }
        }
    }

    #listenerWheel(event) {
        event.preventDefault();
        this.#getDirectionWheel(event.deltaY);
        this.#scrolled();
    }

    #listenerTouchStart(event) {
        event.preventDefault();
        this.#touchStartY = event.touches[0].clientY;
    }

    #listenerTouchFinish(event) {
        event.preventDefault();
        this.#getDirectionTouch(event.changedTouches[0].clientY);
        this.#scrolled();
    }

    #init() {
        this.#container.addEventListener(
            this.#listenerTypes.WHEEL,
            (event) => this.#listenerWheel(event),
            this.#listenerOptions,
        );
        this.#container.addEventListener(
            this.#listenerTypes.TOUCHSTART,
            (event) => this.#listenerTouchStart(event),
            this.#listenerOptions,
        );
        this.#container.addEventListener(
            this.#listenerTypes.TOUCHED,
            (event) => this.#listenerTouchFinish(event),
            this.#listenerOptions,
        );
    }
}