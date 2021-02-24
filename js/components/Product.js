export default class Product extends HTMLElement {

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = this.getTemplate();
    }

    getTemplate() {
        return `
            <style>
            .name {
              border: grey 1px dotted;    
              padding: 1rem;  
              display: flex;
              justify-content: space-between;
            }
            </style>
            <div class="name"><span>${this.data.name} - ${this.data.price} руб.</span></div>
        `;
    }
}