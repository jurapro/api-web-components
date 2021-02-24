import {dEvent, f} from "../main.js";

export default class LoginForm extends HTMLElement {

    constructor() {
        super();
        this.user = null;
        this.data = {
            email: '',
            password: ''
        }
    }

    connectedCallback() {
        this.render(this.getTemplateLogin());
    }

    render(template) {
        this.innerHTML = template;
        this.attachModel();
        this.bindEvents();
    }

    getTemplateLogin() {
        return `
            <h3>Вход</h3>
            <div class="message"></div>
            <label>Логин: <input type="email" data-model="email"></label>            
            <label>Пароль: <input type="password" data-model="password"></label>
            <button data-click="login">Вход</button>          
            `;
    }

    getTemplateOut() {
        return `
            <h3>Вы вошли как ${this.user.email}</h3>
            <button data-click="out">Выход</button>          
            `;
    }

    attachModel() {
        this.querySelectorAll('input')
            .forEach(el => el.addEventListener('input', e => this.inputText(e)));
        this.querySelector('button')
            .addEventListener('click', e => this.clickButton(e));
    }

    inputText(e) {
        if (this.data[e.target.dataset.model]!==undefined) {
            this.data[e.target.dataset.model] = e.target.value;
        }
    }

    clickButton(e) {
        this[e.target.dataset.click]();
    }

    bindEvents() {
        document.addEventListener('user-login', (e) => {
            this.user = e.detail;
            this.render(this.getTemplateOut());
        });

        document.addEventListener('user-out', () => {
            this.render(this.getTemplateLogin());
        });
    }

    async login() {

        if (!this.data.email || !this.data.password) return;
        let res = await f('login', 'post', null, this.data);
        if (res.message) {
            this.querySelector('.message').innerHTML = 'Не правильный логин или пароль';
            return;
        }
        dEvent('user-login', {email: this.data.email, api_token: res.api_token});

    }

    async out() {
        if (!this.user.api_token) return;
        let res = await f('logout', 'post', this.user.api_token, this.data);
        if (!res.message) {
            dEvent('user-out');
        }
    }
}