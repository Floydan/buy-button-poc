import '../localStorage.polyfill';

import AffiliationService from '../services/affiliationService';
import DomElementServices from '../services/domElementService';
import CartItem from './cartItem';
import Toggle from './toggle';

const CART_TEMPLATE = `
            <div id="bbuy-cart" class="bbuy-cart">
                <div class="bbuy-cart-inner">
                    <div class="bbuy-cart-title">
                        <div>Shopping cart</div>
                        <div id="bbuy-cart-close">&times;</div>
                    </div>
                    <div class="bbuy-items-button-container">
                        <div class="bbuy-cart-items"></div>
                        <div class="bbuy-cart-actions">
                            <div id="bbuy-cart-subtotal-container">
                                <span>Subtotal</span> <span id="bbuy-cart-subtotal"></span>
                            </div>
                            <p class="bbuy-cart-disclaimer">
                                Shipping and discount codes are added at checkout.
                            </p>
                            <button class="bbuy-purchase-button">Purchase</button>
                        </div>
                    </div>
                </div>
            </div>`;

class Cart {
    constructor(items) {
        this.items = [];
        this.visible = false;

        this.#setCartItems([...items]);
        this.toggle = new Toggle(this.itemTotalCount());
    }

    #setCartItems(items) {
        if (items && items.length !== 0) {
            for (const item of items) {
                if (item == null) continue;

                this.items.push(new CartItem({ product: item.product, quantity: item.quantity }));
            }
        }
        else {
            const cache = this.getCache();
            if (cache && items) {
                for (const item of cache) {
                    if (item == null) continue;
                    items.push(item);
                }
            }
        }
    }

    render(container) {
        const element = DomElementServices.createElementFromHTML(CART_TEMPLATE);
        this.element = element;
        container.appendChild(this.element);

        this.element.addEventListener('click', (e) => { e.stopPropagation(); });

        console.log(AffiliationService.getData());

        if (!this.element.classList.contains('-initialized'))
            this.element.classList.add('-initialized');

        if (this.items.length !== 0) {
            const cartItemsHolder = this.element.querySelector('.bbuy-cart-items');
            for (const item of this.items) {
                item.render(cartItemsHolder);
            }
        }

        document.getElementById('bbuy-cart-close').addEventListener('click', () => { this.hide(); });
        document.addEventListener('bbuy:item:quantity:change', () => { this.updateTotal() });
        document.addEventListener('bbuy:item:add', (e) => { this.add(e.detail.product, e.detail.quantity); });
        document.addEventListener('bbuy:item:removed', (e) => { this.remove(e.detail); });
        document.addEventListener('bbuy:cart:show', () => { this.show() });

        this.toggle.render(container);

        this.updateTotal();

        if (this.items.length !== 0)
            this.toggle.show();

        return this;
    }

    totalAmount() {
        let total = 0;
        this.items.forEach(item => {
            total += item.quantity * item.product.currentPrice;
        });
        return total;
    }

    itemCount() {
        return this.items.length;
    }

    itemTotalCount() {
        const totalQuantity = this.items.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0);

        return totalQuantity;
    }

    updateTotal() {
        const totalAmount = this.totalAmount();
        document.getElementById('bbuy-cart-subtotal').innerText = new Number(totalAmount).toLocaleString('en');

        let totalQuantity = this.itemTotalCount();

        this.toggle.set(totalQuantity);

        if (totalQuantity === 0)
            this.hide();

        this.setCache();
    }

    find(id) {
        return this.items.find((i) => i.product.id === id);
    }

    add(product, quantity) {
        const cartItemsHolder = this.element.querySelector('.bbuy-cart-items');

        const item = this.find(product.id);

        if (item) {
            item.add(quantity || 1);
        }
        else {
            this.items.push(new CartItem({ product, quantity: quantity || 1 }).render(cartItemsHolder));
        }
        this.updateTotal();
        if(!this.visible)
            this.show();

        this.setCache();
    }

    remove({ item, id }) {
        let index = -1;
        if (item) {
            index = this.items.findIndex((i) => i.product.id === item.id);
        }
        else {
            index = this.items.findIndex((i) => i.product.id === id);
            item = this.items[index];
        }
        if (index === -1) return;

        this.items.splice(index, 1);
        
        if (this.items.length === 0)
            this.hide();

        this.updateTotal();

        this.setCache();
    }

    show() {
        this.visible = true;
        if (!this.element.classList.contains('-active'))
            this.element.classList.add('-active');
        this.toggle.hide();
    }

    hide() {
        this.visible = false;
        if (this.element.classList.contains('-active'))
            this.element.classList.remove('-active');
        this.toggle.show();
    }

    toggle() {
        this.visible = !this.visible;
        this.element.classList.toggle('-active');
        this.visible ? this.toggle.hide() : this.toggle.show();
    }

    setCache() {
        return localStorage.setItem('bbuy-cart', this.export());
    }

    getCache() {
        var cache = localStorage.getItem('bbuy-cart');
        if (!cache) return null;
        return JSON.parse(cache);
    }

    export() {
        return JSON.stringify(this.items);
    }
}

export default Cart;