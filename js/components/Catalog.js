import {dEvent, f} from "../main.js";

export default class Catalog extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.products = [];
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.bindEvents();
    }

    render() {
        this.shadowRoot.append(this.getTitle());
        this.products.forEach(product => this.shadowRoot.append(product));
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Каталог товаров';
        return h;
    }

    bindEvents() {
        document.addEventListener('user-login', (e) => {
            this.user = e.detail;
            this.products.forEach(product => this.addButtonToAddItem(product));
        });

        document.addEventListener('user-out', () => {
            this.user = null;
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
        btn.setAttribute('slot', 'btn-section');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart(product.dataset.id));
        product.append(btn);
        return product;
    }

    removeButtonToAddItem(product) {
        product.querySelector('button')?.remove();
    }

    addItem(item) {
        let product = this.getProduct(item);
        this.products.push(product);
    }

    async loadProducts() {
        let list = await f('products');
        list.forEach(el => {
            this.addItem(el);
        });
        this.render();
    }

    async addToCart(id) {
        let res = await f(`cart/${id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
        alert(res.message);
    }
}
