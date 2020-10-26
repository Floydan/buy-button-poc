import '../string.format.js';
import DomElementServices from '../services/domElementService'

const BUY_BUTTON_TEMPLATE = `
        <div class="bbtn-container">
            <button class="bbtn bb-cta {inheritedClasses}" pid={productId}>
                {innerHtml}
            </button>
            <div class="stock-status">
                <b>In stock: {inventoryStock}</b>
            </div>
        </div>`;

class BuyButton {
    constructor({ productId, innerHtml, inheritedClasses, product, inventory }) {
        this.innerHtml = innerHtml;
        this.inheritedClasses = inheritedClasses;
        this.productId = productId
        this.product = product;
        this.inventory = inventory;
    }

    render(target) {
        this.element = DomElementServices.createElementFromHTML(BUY_BUTTON_TEMPLATE.format({
            innerHtml: this.innerHtml,
            inheritedClasses: this.inheritedClasses,
            productId: this.productId,
            inventoryStock: this.inventory?.stock || 0
        }));
        target.replaceWith(this.element);

        this.element.addEventListener('click', (e) => {
            e.preventDefault();
            setTimeout(() => { document.dispatchEvent(new CustomEvent('bbuy:item:add', { detail: { product: this.product, quantity: 1 } })); }, 25);
        });
        return this;
    }
}

export default BuyButton;