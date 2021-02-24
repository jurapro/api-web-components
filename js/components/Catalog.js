import {dEvent, f} from "../main.js";

export default class Catalog extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.products = [];
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.getTemplate();
        this.bindEvents();
    }

    getTemplate() {
        return `
        <h2>Каталог товаров</h2>
        `;
    }

    bindEvents() {
        document.addEventListener('user-login', (e) => {
            this.user = e.detail;
            this.products.forEach(product => this.addButtonToAddItem(product));
        });

        document.addEventListener('user-out', () => {
            this.products.forEach(product => this.removeButtonToAddItem(product));
        });
    }

    getProduct(data) {
        const product = document.createElement('shop-product');
        product.dataset.id = data.id;
        product.dataset.name = data.name;
        product.dataset.price = data.price;
        product.dataset.description = data.description;
        return product;
    }

    addButtonToAddItem(product) {
        let btn = document.createElement('button');
        btn.setAttribute('slot','btn-section');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart(product.dataset.id));
        product.append(btn);
    }

    removeButtonToAddItem(product) {
        product.querySelector('button')?.remove();
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => {
            let product = this.getProduct(el);
            this.products.push(product);
            this.shadowRoot.append(product);
        });
    }

    async addToCart(id) {
        let res = await f(`cart/${id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }
}
