
// https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements

class MyComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = this.#template
    }

    connectedCallback() {
        this.#refresh()

        document.addEventListener('click', (event) => {
            this.#refresh()
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.#update(name, newValue)
    }

    #refresh() {
        const attr = this.attrWithoutPrefix

        this.#todoItem.then((data) => {
            this.dataset[attr.todo] = data.title
            this.dataset[attr.isDone] = data.completed
        });
    }

    #update(attribute, value) {
        console.log(attribute, value)
        const element = this.shadowRoot.querySelector(`[${attribute}]`)
        if (!element) return void console.log("Element not found")
        element.innerHTML = value
    }

    // it is violates the HTML [spec](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)
    get #template() {
        const attr = this.attr
        return `
            <style>
            @import url('./styles.css')
            </style>
            <h1 ${attr.todo}>Author</h1>
            <p ${attr.isDone}>Quote</p>
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
     * @returns {Promise<TodoItem>} 
     */
    get #todoItem() {
        const id = Math.floor(Math.random() * 100) + 1
        return fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
            .then(response => response.json())
            .catch(error => console.error(error))
    }

    /**
     * @type {attributes}
     */
    static attributes = {
        todo: 'data-todo',
        isDone: 'data-isdone'
    }

    static observedAttributes = Object.values(MyComponent.attributes)
}

customElements.define('my-component', MyComponent)


/**
 * @typedef {Object} attributes
 * @property {string} todo 
 * @property {string} isDone
 */

/**
 * @typedef {Object} TodoItem
 * @property {number} userId - The ID of the user.
 * @property {number} id - The ID of the todo item.
 * @property {string} title - The title of the todo item.
 * @property {boolean} completed - Indicates whether the todo item is completed or not.
 */