import Product from './product';

class Variant extends Product {
    constructor(productId, { id, name, images, description, originalPrice, currentPrice }) {
        super(arguments[1]);

        this.productId = productId;
        delete this.variants;
    }
}

export default Variant;