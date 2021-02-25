export default class Order extends HTMLElement {

    constructor() {
        super();
        this.items = [];
        this.products = new Set();
    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.id = this.dataset.id;
        this.created = this.dataset.created;
        this.render();
    }

    loadItems(items) {
        this.items = items;
        this.items.forEach(el=>this.products.add(el.id));
    }

    render() {
        this.shadowRoot.append(this.getTitle());
        this.products.forEach(id => {
            this.shadowRoot.append(this.getItem(id));
        });
        this.shadowRoot.append(this.getPriceTitle());
    }

    getTitle() {
        const h = document.createElement('h4');
        h.textContent = `Заказ #${this.id}. Сформирован: ${this.getCreated()}`;
        return h;
    }

    getCreated() {
        let ms = Date.parse(this.created);
        return new Date(ms).toLocaleString();
    }

    getItem(id) {
        let item = this.getFirstProduct(id);
        let product = this.createProductElement(item);
        this.addCountTitle(product);
        return product;
    }

    getPriceTitle() {
        const h = document.createElement('h4');
        h.textContent = `Сумма итого: ${this.getAllPrice().toLocaleString()} руб.`;
        return h;
    }

    getCountProduct(id) {
        return this.items.filter(el => el.id === id).length;
    }

    getAllPrice() {
        return this.items.reduce((sum, el) => sum + el.price, 0);
    }

    getFirstProduct(id) {
        return this.items.find(item => item.id === id);
    }

    createProductElement(data) {
        console.log(data);
        let product = document.createElement('shop-product');
        product.dataset.id = data.id;
        product.dataset.name = data.name;
        product.dataset.price = data.price;
        product.dataset.description = data.description;
        return product;
    }

    addCountTitle(product) {
        let h = document.createElement('span');
        h.setAttribute('slot', 'btn-section');
        h.textContent = this.getCountProduct(+product.dataset.id).toString();
        product.append(h);
        return product;
    }

}
