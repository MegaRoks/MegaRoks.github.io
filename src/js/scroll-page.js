class ScrollPage {
    #container;
    #targetScrollPage;
    #elements;
    #direction;

    constructor(container, elements) {
        this.#elements = elements;
        this.#container = container;
        this.#isScrolledIntoView(elements);
    }

    #isScrolledIntoView(elements) {
        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom;

            if ((elemTop >= 0) && (elemBottom <= window.innerHeight)) {
                this.#targetScrollPage = element.getAttributeNode('id').value;
            }
        })

    }

    #getDirection(event) {
        const delta = Math.sign(event.deltaY);

        this.#direction = delta === 1 ? 'up' : 'down';
    }

    #scrolled(event) {
        event.preventDefault();

        // TODO refactor
        if (this.#direction === 'up') {
            if (this.#targetScrollPage === 'scroll-page-1') {
                this.#elements[1].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
                this.#targetScrollPage = this.#elements[1].getAttributeNode('id').value;
            } else if (this.#targetScrollPage === 'scroll-page-2') {
                this.#elements[2].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
                this.#targetScrollPage = this.#elements[2].getAttributeNode('id').value;
            }
        } else {
            if (this.#targetScrollPage === 'scroll-page-3') {
                this.#elements[1].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
                this.#targetScrollPage = this.#elements[1].getAttributeNode('id').value;
            } else if (this.#targetScrollPage === 'scroll-page-2') {
                this.#elements[0].scrollIntoView({
                    block: "center",
                    behavior: "smooth"
                });
                this.#targetScrollPage = this.#elements[0].getAttributeNode('id').value;
            }
        }
    }

    #listener(event) {
        this.#getDirection(event);
        this.#scrolled(event);
    }

    init() {
        this.#container.addEventListener("wheel", (event) => this.#listener(event), {
            passive: false
        });
    }
}