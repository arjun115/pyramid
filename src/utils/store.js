class Store {

    _storeName = null

    _events = {}
    _data = {}

    on = (key, callback) => this._listen(key, callback, false)

    once = (key, callback) => this._listen(key, callback, true)

    constructor(name) {
        this._storeName = `bytehope_${name}`
        setInterval(() => this._maintain(), 2500)
        this._load()
    }

    set(key, value = null) {
        if (typeof key !== 'string') {
            throw Error('the key must be a string')
        }

        this._data[key] = value
        this._trigger(key)
    }

    get(key) {
        if (typeof key !== 'string') {
            throw Error('the key must be a string')
        }
        return this._data[key]
    }

    check(key) {
        return typeof this._data[key] !== 'undefined'
    }

    remove(key) {
        delete this._events[key]
        delete this._data[key]
    }

    clean() {
        this._events = {}
        this._data = {}
    }

    removeListeners(key) {
        delete this._events[key]
    }

    off(key, callback) {
        if (typeof this._events[key] === 'undefined') {
            throw Error(`provided callback doesn't exist in [${key}] listeners`)
        }
        this._events[key] = this._events[key].filter(event => callback !== callback)
    }

    _listen(key, callback, once) {
        if (typeof key !== 'string') {
            throw Error('the key must be a string')
        }
        
        if (typeof callback !== 'function') {
            throw Error('the callback must be a function')
        }

        if (typeof this._events[key] === 'undefined') {
            this._events[key] = []
        }

        this._events[key].push({ callback, once, remove: false })
    }

    _trigger(key) {
        if (typeof this._events[key] === 'undefined') {
            return
        }

        let eventList = this._events[key]

        for (let event of eventList) {
            if (event.once) {
                event.remove = true
            }
            if (event.remove) {
                event.callback(this._data[key])
            }
        }
    }

    _maintain() {
        for (let key in this._events) {
            this._events[key] = this._events[key].filter(event => !event.remove)
        }
        let data = btoa(JSON.stringify(this._data))
        localStorage.setItem(this._storeName, data)
    }

    _load() {
        let plainData = localStorage.getItem(this._storeName)
        if (!plainData) {
            return
        }
        this._data = JSON.parse(atob(plainData))
    }
}

let storeMap = {}

export const getStore = (name = 'default') => {
    if (typeof name !== 'string') {
        throw Error('store name must be a string')
    }
    if (typeof storeMap[name] === 'undefined') {
        storeMap[name] = new Store(name)
    }
    return storeMap[name]
}