import {f} from "../main.js";

export default class Orders extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.orders = [];
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', (e) => {
            this.user = e.detail;
            this.loadOrders();
        });
        document.addEventListener('user-out', () => {
            this.user = null;
            this.clear();
        });
        document.addEventListener('order-by', () => {
            this.loadOrders();
        });
    }

    render() {
        this.shadowRoot.append(this.getTitle());
        this.orders.forEach(el => {
            this.shadowRoot.append(el);
            //console.log(el);
        });
    }

    getTitle() {
        const h = document.createElement('h3');
        h.textContent = 'Ваши заказы';
        return h;
    }

    clear() {
        this.orders = [];
        this.shadowRoot.innerHTML = '';
    }

    addOrder(order) {
        this.orders.push(this.createOrder(order));
    }

    createOrder(data) {
        let order = document.createElement('shop-order');
        order.dataset.id = data.id;
        order.dataset.created = data.created;
        order.loadItems(data.products);
        return order;
    }

    async loadOrders() {
        this.clear();
        let list = await f('order', 'get', this.user.api_token);
        list.forEach(el => this.addOrder(el));
        this.render();
    }
}
