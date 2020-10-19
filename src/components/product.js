class Product {
    constructor({ id, name, images, description, originalPrice, currentPrice, variants }) {
        this.id = id;
        this.name = name;
        this.images = images;
        this.description = description;
        this.originalPrice = originalPrice;
        this.currentPrice = currentPrice;
        this.variants = variants;
    }
}

export default Product;