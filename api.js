// TODO: hide the key
const API_KEY = "AAjRzUJ11rEKA/RVqt0gaQ==ItIzRjjzR3RPGWfU"

export class QuoteApi extends EventTarget {
    #url = "https://api.api-ninjas.com/v1/quotes"
    #isFetching = false

    /**
     * More categories here https://api-ninjas.com/api/quotes
     * @param {('life', 'humor', 'happiness', 'funny', 'friendship')} category 
     * @returns {Promise<QuoteItem>}
     */
    getQuote(category) {
        const url = this.#getUrl(category)

        if (this.#isFetching) {
            return void console.log("Already fetching")
        }
        this.#indicateStart()
        return fetch(url, {
            headers: {
                "X-Api-Key": API_KEY
            }
        })
            .then(response => response.json())
            .then(data => data[0])
            .catch(error => console.error(error))
            .finally(() => this.#indicateEnd())
    }

    #indicateStart() {
        this.#isFetching = true
        this.dispatchEvent(new Event('start'))
    }

    #indicateEnd() {
        this.#isFetching = false
        this.dispatchEvent(new Event('end'))
    }

    #getUrl(category) {
        return category ? `${this.#url}?category=${category}` : this.#url
    }

    get isFetching() {
        return this.#isFetching
    }
}


/**
 * @typedef {Object} QuoteItem
 * @property {string} quote
 * @property {string} author
 * @property {string} category
 */