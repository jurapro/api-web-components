import {dEvent, f} from "../main.js";

export default class Cart extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.items = [];
        this.products = new Set();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.bindEvents();
    }

    render() {
        this.shadowRoot.append(this.getTitle());
        this.products.forEach(id => {
            this.shadowRoot.append(this.getItem(id));
        });

        this.shadowRoot.append(this.getPriceTitle());
        this.shadowRoot.append(this.getButtonAddOrder());
    }

    bindEvents() {
        document.addEventListener('user-login', (e) => {
            this.user = e.detail;
            this.loadProducts();
        });

        document.addEventListener('user-out', () => {
            this.clearCart();
        });

        document.addEventListener('add-to-cart', () => {
            this.loadProducts();
        });

        document.addEventListener('remove-to-cart', () => {
            this.loadProducts();
        });

        document.addEventListener('order-by', () => {
            this.loadProducts();
        });
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    getItem(id) {
        let item = this.getFirstProduct(id);
        let product = this.createProductElement(item.product);
        this.addButtonToRemoveFromCart(product, item.id);
        this.addCountTitle(product);
        this.addButtonToAddItem(product);
        return product;
    }

    getPriceTitle() {
        const h = document.createElement('h3');
        h.textContent = `Сумма вашего заказа: ${this.getAllPrice().toLocaleString()} руб.`;
        return h;
    }

    getCountProduct(id) {
        return this.items.filter(el => el.product.id === id).length;
    }

    getAllPrice() {
        let cost = 0;
        this.items.forEach(el => {
            cost += el.product.price;
        });
        return cost;
    }

    getButtonAddOrder() {
        let btn = document.createElement('button');
        btn.classList.add('order-btn');
        btn.textContent = 'Оформить заказ';
        btn.addEventListener('click', () => this.order());
        return btn;
    }

    getFirstProduct(id) {
        return this.items.find(item => item.product.id === id);
    }

    createProductElement(data) {
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
    }

    addButtonToRemoveFromCart(product, id) {
        let btn = document.createElement('button');
        btn.setAttribute('slot', 'btn-section');
        btn.textContent = '-';
        btn.addEventListener('click', () => this.removeFromCart(id));
        product.append(btn);
    }

    addCountTitle(product) {
        let h = document.createElement('span');
        h.setAttribute('slot', 'btn-section');
        h.textContent = this.getCountProduct(+product.dataset.id).toString();
        product.append(h);
    }

    addItem(el) {
        this.items.push(el);
        this.products.add(el.product.id);
    }

    clearCart() {
        this.items = [];
        this.products.clear();
        this.shadowRoot.innerHTML = '';
    }

    async loadProducts() {
        this.clearCart();
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => {
            this.addItem(el);
        });
        this.render();
    }

    async addToCart(id) {
        await f(`cart/${id}`, 'post', this.user.api_token);
        dEvent('add-to-cart');
    }

    async removeFromCart(id) {
        await f(`cart/${id}`, 'delete', this.user.api_token);
        dEvent('remove-to-cart');
    }

    async order() {
        let res = await f(`order`, 'post', this.user.api_token);
        if (res.message) {
            alert(res.message);
            return;
        }
        alert(`Заказ оформлен. Сумма заказа составила: ${this.getAllPrice()}`);
        dEvent('order-by');
    }
}
