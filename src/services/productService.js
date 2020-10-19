import Product from '../components/product';
import Variant from '../components/variant';

class ProductService {
    constructor(affilateId) {
        this.affilateId = affilateId;
        this.products = [];
    }
    async getProduct(productid) {
        return new Promise(async (resolve, reject) => {

            const cache = this.products.find((p) => p.id === productid);
            if (cache && cache.id) {
                resolve(cache);
                return;
            }

            try {
                const product = await this.#sendRequest('GET', `/products/${productid}`);
                var variants = [];

                if (product && product.id) {

                    if (product.variants) {
                        for (const variant of product.variants) {
                            variants.push(new Variant(product.id, variant));
                        }
                        product.variants = variants;
                    }

                    const prod = new Product(product);

                    this.products.push(prod);
                    resolve(prod);
                    return;
                }
                reject(`Product with id ${productid} could not be found.`)

            } catch (e) {
                reject(e);
            }
        });
    }

    async getInventoryStatus(productid) {
        return new Promise(async (resolve, reject) => {
            try {
                const inventory = await this.#sendRequest('GET', `/inventory/${productid}`);
                resolve(inventory);
            } catch (e) {
                reject(e);
            }
        });
    }

    async #sendRequest(method, url, data, callback) {
        return new Promise((resolve, reject) => {
            var req = new XMLHttpRequest();
            req.open(method, url, true);
            req.responseType = 'json';
            req.setRequestHeader('Affiliate-Id', this.affilateId);
            req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    if (callback)
                        callback(req.response);
                    resolve(req.response);
                }
            }

            req.onerror = (evt) => {
                reject(evt);
            }

            data ? req.send(data) : req.send();
        });
    }
}

export default ProductService;