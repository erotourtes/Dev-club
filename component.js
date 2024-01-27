import { QuoteApi } from './api.js'

// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

class MyComponent extends HTMLElement {
    api = new QuoteApi()

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = this.#template
    }

    connectedCallback() {
        this.#refresh()
        this.#listen()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#update(name, newValue)
    }

    #listen() {
        const loadContainer = this.shadowRoot.querySelector('.loader-container')
        const loader = loadContainer.children[0]
        this.api.addEventListener('start', () => {
            loader.classList.add('loader')
        })

        this.api.addEventListener('end', () => {
            loader.classList.remove('loader')
        })

        document.addEventListener('click', (event) => {
            if (this.api.isFetching) return void console.log("Already fetching")
            this.#refresh()
        })
    }

    #refresh() {
        this.api.getQuote().then((data) => {
            this.#checkConsistency(data)
            Object.assign(this.dataset, data)
        });
    }

    #update(attribute, value) {
        const element = this.shadowRoot.querySelector(`[${attribute}]`)
        if (!element) return void console.log("Element not found")
        element.innerHTML = value
    }

    #checkConsistency(data) {
        const attr = this.attrWithoutPrefix
        const keys = Object.keys(data)
        const missing = Object.values(attr).filter((key) => !keys.includes(key))
        if (missing.length) {
            throw new Error(`Missing data: ${missing.join(', ')}`)
        }
    }

    // it is violates the HTML [spec](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)
    get #template() {
        const attr = this.attr
        return `
            <style>
            @import url('./styles.css')
            </style>
            <h1 ${attr.quote}>Quote</h1>
            <div class="loader-container"><div class="loader"></div></div>
            <span ${attr.category}>Category</span>
            <p ${attr.author}>Author</p>
        `
    }

    get attr() {
        return MyComponent.attributes
    }

    /**
     * @returns {attributes}
     */
    get attrWithoutPrefix() {
        const entries = Object.entries(this.attr)
            .map(([key, value]) => [key, value.slice('data-'.length)])
        return Object.fromEntries(entries)
    }

    /**
     * @type {attributes}
     */
    static attributes = {
        quote: 'data-quote',
        author: 'data-author',
        category: 'data-category',
    }

    static observedAttributes = Object.values(MyComponent.attributes)
}

customElements.define('my-component', MyComponent)


/**
 * @typedef {Object} attributes
 * @property {string} quote 
 * @property {string} author
 * @property {string} category
 */