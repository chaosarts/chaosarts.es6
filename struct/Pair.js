/**
 * @constructor
 * @template KeyType
 * @template ValueType
 */
export class Pair {

    /**
     * Accessor for the key
     * @public
     * @return {KeyType}
     */
    get key () {
        return this._key;
    }

    /**
     * Accessor for the value
     * @public
     * @return {ValueType}
     */
    get value () {
        return this._value;
    }


    /**
     * Creates a new key-value Pair
     * @public
     * @param {KeyType} key
     * @param {ValueType} value
     */
    constructor (key, value) {
        this._key = key;
        this._value = value;
    }
}