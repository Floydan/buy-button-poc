import '../string.format.js';
import DomElementServices from '../services/domElementService'

const CART_ITEM_TEMPLATE = `
            <div class="bbuy-cart-item" pid="{id}">
                <div class="bbuy-cart-item-image"></div>
                <div class="bbuy-cart-item-content">
                    <div class="bbuy-cart-item-name">{name}</div>
                    <div class="bbuy-cart-item-price-quantity-container">
                        <div>
                            <span class="bbuy-cart-item-subtract">&minus;</span> 
                            <b class="bbuy-cart-item-quantity">{quantity}</b> 
                            <span class="bbuy-cart-item-add">&plus;</span>
                        </div>
                        <div>
                            <span class="bbuy-cart-item-price">{currentPrice}</span>
                        </div>
                    </div>
                </div>
                <div class="bbuy-cart-item-remove">&times</div>
            </div>`;

class CartItem {
    constructor({ product, quantity }) {
        this.product = product;
        this.quantity = quantity;
    }

    render(container) {
        const hasImage = this.product.images && this.product.images.length !== 0;
        const element = DomElementServices.createElementFromHTML(CART_ITEM_TEMPLATE.format({
            id: this.product.id,
            name: this.product.name,
            image: hasImage ? this.product.images[0] : '',
            currentPrice: new Number(this.product.currentPrice).toLocaleString('en-US'),
            quantity: this.quantity
        }));

        this.element = element;

        if (!hasImage) {
            this.element.querySelector('.bbuy-cart-item-image', this.element).innerText = '?';
        }
        else {
            const img = document.createElement('img');
            img.src = this.product.image[0];
            this.element.querySelector('.bbuy-cart-item-image', this.element).appendChild(img);
        }

        container.appendChild(this.element);

        this.element.querySelector('.bbuy-cart-item-add').addEventListener('click', () => { this.add(1); });
        this.element.querySelector('.bbuy-cart-item-subtract').addEventListener('click', () => { this.subtract(1); });
        this.element.querySelector('.bbuy-cart-item-remove').addEventListener('click', () => this.remove());

        return this;
    }

    add(amount) {
        this.quantity += amount;
        this.element.querySelector('.bbuy-cart-item-quantity').innerText = this.quantity;
        this.element.querySelector('.bbuy-cart-item-price').innerText = new Number(this.quantity * this.product.currentPrice).toLocaleString('en-US');

        document.dispatchEvent(new CustomEvent('bbuy:item:quantity:change'));
    }

    subtract(amount) {
        this.quantity -= amount;
        this.element.querySelector('.bbuy-cart-item-quantity').innerText = this.quantity;
        this.element.querySelector('.bbuy-cart-item-price').innerText = new Number(this.quantity * this.product.currentPrice).toLocaleString('en-US');

        document.dispatchEvent(new CustomEvent('bbuy:item:quantity:change'));
        if (this.quantity <= 0)
            this.remove();
    }

    remove() {
        this.element.querySelector('.bbuy-cart-item-add').removeEventListener('click', () => { this.add(1); });
        this.element.querySelector('.bbuy-cart-item-subtract').removeEventListener('click', () => { this.subtract(1); });
        this.element.querySelector('.bbuy-cart-item-remove').removeEventListener('click', null);
        this.element.remove();

        document.dispatchEvent(new CustomEvent('bbuy:item:removed', { detail: { id: this.product.id } }));
    }

    update(product) {
        if (!product || !product.id) return;

        this.product = product;
        const hasImage = this.product.images && this.product.images.length !== 0;
        if (!hasImage) {
            this.element.querySelector('.bbuy-cart-item-image').innerText = '?';
        }
        else {
            const img = document.createElement('img');
            img.src = this.product.image[0];
            this.element.querySelector('.bbuy-cart-item-image').appendChild(img);
        }
        this.element.querySelector('.bbuy-cart-item-price').innerText = new Number(this.quantity * this.product.currentPrice).toLocaleString('en-US');
        document.dispatchEvent(new CustomEvent('bbuy:item:quantity:change'));
    }
}

export default CartItem;