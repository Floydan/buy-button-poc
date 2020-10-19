import '../src/sass/main.scss';
import './string.format.js';
import 'core-js/features/promise';
import 'core-js/features/string/split';

import AffiliationService from './services/affiliationService';
import ProductService from './services/productService';

import Cart from './components/cart';
import BuyButton from './components/buyButton';

(function () {
    const STACK_TRACE_SPLIT_PATTERN = /(?:Error)?\n(?:\s*at\s+)?/;
    const STACK_TRACE_ROW_PATTERN1 = /^.+?\s\((.+?):\d+:\d+\)$/;
    const STACK_TRACE_ROW_PATTERN2 = /^(?:.*?@)?(.*?):\d+(?::\d+)?$/;

    let affilateId = '';
    let cart = null;

    const getFileParams = () => {
        const stack = new Error().stack;
        if (!stack) {
            console.warn("Something went wrong. This probably means that the browser you are using is non-modern. You should debug it!");
            return;
        }
        const row = stack.split(STACK_TRACE_SPLIT_PATTERN, 2)[1];
        const [, url] = row.match(STACK_TRACE_ROW_PATTERN1) || row.match(STACK_TRACE_ROW_PATTERN2) || [];
        if (!url) {
            console.warn("Something went wrong. This probably means that the browser you are using is non-modern. You should debug it!");
            return;
        }
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams || urlObj.search;
        } catch (e) {
            console.warn(`The URL '${url}' is not valid.`);
        }
    };

    async function loadStyle(url) {
        return new Promise((resolve, reject) => {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.onload = () => { resolve(); };
            link.onerror = () => { reject(); };
            link.href = url;

            let headLink = document.querySelector('link');
            headLink.parentNode.insertBefore(link, headLink);
        });
    };

    async function init() {
        try {
            await loadStyle('/assets/css/main.css'); //replace with public absolute path url

            const params = getFileParams();
            affilateId = params?.get('aid');
            console.log('Affiliate id:', affilateId);
            console.log('Version:', params?.get('v') || 'version missing');

            const affiliationData = AffiliationService.setData(affilateId, params?.get('v'));

            createCart();

            setTimeout(async () => {

                const productService = new ProductService(affiliationData.affiliateId);

                const buyButtonPlaceHolders = document.getElementsByTagName('buy-button');
                for (let buyButtonTemplate of buyButtonPlaceHolders) {
                    createBuyButton(productService, buyButtonTemplate);
                }

                if (cart.itemCount() > 0) {
                    for (const cartItem of cart.items) {
                        const product = await productService.getProduct(cartItem.product.id);
                        cartItem.update(product);
                    }
                }
            });
        } catch (e) {
            console.warn ? console.warn(e) : console.log(e);
        }
    }

    function createCart() {
        const body = document.getElementsByTagName('body')[0];
        const html = document.getElementsByTagName('html')[0];

        cart = new Cart([]).render(body);

        html.addEventListener('click', (e) => {
            if (cart.visible)
                e.target === cart.element || cart.element.contains(e.target) || e.target.classList.contains('bbtn') || cart.hide();
        });
    }

    async function createBuyButton(productService, template) {
        let innerHtml = template.innerHTML || 'Buy';
        let inheritedClasses = template.classList || '';
        let productId = (template.attributes["productid"] || template.attributes["pid"])?.value || '';

        try {
            const product = await productService.getProduct(productId);
            const inventory = await productService.getInventoryStatus(productId);
            innerHtml = `${innerHtml} ${product.name}`;
            new BuyButton({ productId, innerHtml, inheritedClasses, product, inventory }).render(template);
        } catch (e) {
            //do nothing
            throw e;
        }
    }

    function getCart() {

    }

    init();
})();
