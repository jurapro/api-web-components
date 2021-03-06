import Catalog from "./components/Catalog.js";
import LoginForm from "./components/LoginForm.js";
import Cart from "./components/Cart.js";
import Product from "./components/Product.js";
import Order from "./components/Order.js";
import Orders from "./components/Orders.js";

import User from "./classes/User.js";

const host = 'http://localhost/api';
const f = async (url, method = 'get', token = null, data = []) => {
    const options = {
        method: method.toUpperCase(),
        headers: {
            "Content-Type": 'application/json'
        },
    }

    if (token)
        options.headers['Authorization'] = `Bearer ${token}`

    if (['post', 'patch'].includes(method))
        options.body = JSON.stringify(data)

    return await fetch(`${host}/${url}`, options).then(res => res.json());
}

const dEvent = (event, detail) => {
    document.dispatchEvent(new CustomEvent(
        event, {
            detail: detail
        }
    ));
}

class App {

    constructor() {
        this.user = new User();
        this.$html = document.querySelector('main');
        this.catalog = document.querySelector('shop-catalog');
        this.defineElements();
        this.loadData();
    }


    defineElements() {
        customElements.define('shop-product', Product);
        customElements.define('shop-catalog', Catalog);
        customElements.define('shop-login', LoginForm);
        customElements.define('shop-cart', Cart);
        customElements.define('shop-order', Order);
        customElements.define('shop-orders', Orders);
    }

    async loadData() {
        await this.catalog.loadProducts();
        await this.user.load();
    }
}

new App();

export {f, dEvent};