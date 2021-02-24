import {dEvent, f} from "../main.js";

export default class Cart extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.items = [];
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.bindEvents();
    }

    render() {
        this.shadowRoot.append(this.getTitle());
        this.items.forEach(el => {
            this.addButtonToRemoveFromCart(el);
            this.addCountTitle(el);
            this.addButtonToAddItem(el);
            this.shadowRoot.append(el.product);
        });
        this.shadowRoot.append(this.getPriceTitle());
        this.shadowRoot.append(this.getButtonAddOrder());
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваша корзина';
        return h;
    }

    getPriceTitle() {
        const h = document.createElement('h3');
        h.textContent = `Сумма вашего заказа: ${this.getPrice().toLocaleString()} руб.`;
        return h;
    }

    getPrice() {
        let cost = 0;
        this.items.forEach(el => {
            cost += el.count * el.price;
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

    getProduct(data) {
        const product = document.createElement('shop-product');
        product.dataset.id = data.id;
        product.dataset.name = data.name;
        product.dataset.price = data.price;
        product.dataset.description = data.description;
        return product;
    }

    addButtonToAddItem(item) {
        let btn = document.createElement('button');
        btn.setAttribute('slot', 'btn-section');
        btn.textContent = '+';
        btn.addEventListener('click', () => this.addToCart(item.product.dataset.id));
        item.product.append(btn);
    }

    addButtonToRemoveFromCart(item) {
        let btn = document.createElement('button');
        btn.setAttribute('slot', 'btn-section');
        btn.textContent = '-';
        btn.addEventListener('click', () => this.removeFromCart(item.id));
        item.product.append(btn);
    }

    addCountTitle(item) {
        let h = document.createElement('span');
        h.setAttribute('slot', 'btn-section');
        h.textContent = item.count;
        item.product.append(h);
    }

    addItem(product, id) {
        let el = this.items.find((el) => el.id_product === product.dataset.id);
        if (el) {
            el.count++;
            el.product.dataset.price = (el.price * el.count).toString();
            return;
        }

        this.items.push({
            id: id,
            id_product: product.dataset.id,
            product: product,
            count: 1,
            price: product.dataset.price,
        })
    }

    clearCart() {
        this.items = [];
        this.shadowRoot.innerHTML = '';
    }

    async loadProducts() {
        this.clearCart();
        let list = await f('cart', 'get', this.user.api_token);
        list.forEach(el => {
            let product = this.getProduct(el.product);
            this.addItem(product, el.id);
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
        alert(`Заказ оформлен. Сумма заказа составила: ${this.getPrice()}`);
        dEvent('order-by');
    }
}
