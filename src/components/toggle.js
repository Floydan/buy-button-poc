import DomElementServices from '../services/domElementService'

const CART_TOGGLE_TEMPLATE = `
            <div id="bbuy-toggle" class="bbuy-toggle">
                <div class="toggle-count"></div>
                <div class="toggle-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill='#FFFFFF'><path d="M21.96 14.27l2-7c.09-.3.03-.63-.16-.88-.19-.24-.49-.39-.8-.39H5V4c0-.55-.45-1-1-1H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .01.01.02.01.04 0 .1.02.21.05.3l2.55 7L6.57 17H4c-.55 0-1 .45-1 1s.45 1 1 1h17c.55 0 1-.45 1-1s-.45-1-1-1H8.7l-.73-2H21c.45 0 .84-.3.96-.73zM21.1 10H18V8h3.67l-.57 2zM13 11v2h-3v-2h3zm-3-1V8h3v2h-3zm4 1h3v2h-3v-2zm0-1V8h3v2h-3zM9 8v2H6.15l-.72-2H9zm-2.29 3.52L6.52 11H9v2H7.25l-.54-1.48zM18 13v-2h2.82l-.57 2H18z"></path><circle cx="5" cy="21" r="2"></circle><circle cx="20" cy="21" r="2"></circle></g></svg>
                </div>
            </div>`;

class Toggle {
    constructor(itemCount) {
        this.itemCount = itemCount;
        this.visible = false;
    }

    render(container) {
        const element = DomElementServices.createElementFromHTML(CART_TOGGLE_TEMPLATE);
        this.element = element;
        container.appendChild(this.element);

        this.element.addEventListener('click', () => { setTimeout(() => { document.dispatchEvent(new CustomEvent('bbuy:cart:show')); }, 25); });

        return this;
    }

    set(amount) {
        this.itemCount = amount;
        this.#updateToggleCount();
    }

    add(amount) {
        this.itemCount += amount;
        this.#updateToggleCount();
    }

    remove(amount) {
        this.itemCount -= amount;
        if (this.itemCount < 0) this.itemCount = 0;
        this.#updateToggleCount();
    }

    show() {
        setTimeout(() => {
            this.visible = true;
            if (!this.element.classList.contains('-active'))
                this.element.classList.add('-active');
        }, 25);
    }

    hide() {
        setTimeout(() => {
            this.visible = false;
            if (this.element.classList.contains('-active'))
                this.element.classList.remove('-active');
        }, 25);
    }

    toggle() {
        setTimeout(() => {
            this.visible = !this.visible;
            this.element.classList.toggle('-active');
        }, 25);
    }

    #updateToggleCount() {
        this.element.querySelector('.toggle-count').innerText = this.itemCount > 0 ? this.itemCount : ''
    }
}

export default Toggle;