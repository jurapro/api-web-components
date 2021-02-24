import {f,dEvent} from "../main.js";

export default class User {

    constructor() {
        this.email = '';
        this.api_token = '';
        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('user-login', e => {
            this.email = e.detail.email;
            this.api_token = e.detail.api_token;
            this.save();
        });

        document.addEventListener('user-out', () => {
            this.email = '';
            this.api_token = '';
            this.save();
        });
    }

    save() {
        localStorage.setItem('user', JSON.stringify({email: this.email, api_token: this.api_token}));
    }

    async load() {
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user) return;

        if (!await this.check(user.api_token)) return;

        dEvent('user-login', {email: user.email, api_token: user.api_token});
    }

    async check(api_token) {
        let res = await f('user', 'get', api_token);
        return !res.message;
    }

}

