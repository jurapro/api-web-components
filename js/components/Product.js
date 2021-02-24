export default class Product extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = this.getTemplate();
        this.shadowRoot.querySelector('.name>span').addEventListener('click',()=>{
            this.shadowRoot.querySelector('.description').classList.toggle('hide');
        })
    }

    static get observedAttributes() {
        return ['data-id', 'data-name', 'data-price', 'data-description'];
    }

    attributeChangedCallback() {
        this.render();
    }

    getTemplate() {
        return `
            <style>
            .item {
              padding: 1rem;  
              border: grey 1px dotted;   
            }
            .name {
              display: flex;
              justify-content: space-between;
              padding: .3rem;
              
            }
            .name > span {
              cursor: pointer;
            }
            .hide {
                display: none;
            }
            .btn {
                display: flex;
                gap: 1rem;
            }
            </style>
            <div class="item">
               <div class="name">
                    <span>${this.dataset.name} - ${this.dataset.price} руб.</span>
                    <div class="btn">
                     <slot name="btn-section">
                    </slot>
                    </div>
               </div>            
                <div class="description hide">
                <hr>
                ${this.dataset.description}
                </div>
            </div>
        `;
    }

}