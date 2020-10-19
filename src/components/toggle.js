import DomElementServices from '../services/domElementService'

const CART_TOGGLE_TEMPLATE = `
            <div id="bbuy-toggle" class="bbuy-toggle">
                <div class="toggle-count"></div>
                <div class="toggle-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon-cart" data-element="toggle.icon" viewBox="0 0 25 25" enable-background="new 0 0 25 25"><g class="shopify-buy__icon-cart__group"><path d="M24.6 3.6c-.3-.4-.8-.6-1.3-.6h-18.4l-.1-.5c-.3-1.5-1.7-1.5-2.5-1.5h-1.3c-.6 0-1 .4-1 1s.4 1 1 1h1.8l3 13.6c.2 1.2 1.3 2.4 2.5 2.4h12.7c.6 0 1-.4 1-1s-.4-1-1-1h-12.7c-.2 0-.5-.4-.6-.8l-.2-1.2h12.6c1.3 0 2.3-1.4 2.5-2.4l2.4-7.4v-.2c.1-.5-.1-1-.4-1.4zm-4 8.5v.2c-.1.3-.4.8-.5.8h-13l-1.8-8.1h17.6l-2.3 7.1z"></path><circle cx="9" cy="22" r="2"></circle><circle cx="19" cy="22" r="2"></circle></g></svg>
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