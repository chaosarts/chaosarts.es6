
/**
 * @template ElementType
 */
export class Collection {

    /** 
     * Accessor to get the count of elements of this queue
     * @public
     * @return {number}
     */
    get length () {
        return this._elements.length;
    }

    /**
     * Accessor to get the count of elements of this queue. A capacity of zero
     * indicates "infinity".
     * @public
     * @return {number}
     */
    get capacity () {
        return this._capacity;
    }

    /**
     * Accessor to indicate whether the queue is empty or not
     * @public
     * @return {boolean}
     */
    get isEmpty () {
        return this._elements.length == 0;
    }

    /**
     * Returns the collection as array
     * @public
     * @return {Array<ElementType>}
     */
    get array () {
        return this._elements.slice(0);
    }


    /**
     * @public
     * @param {Array<ElementType>=}
     */
    constructor (elements = null, capacity = 0) {

        /**
         * Provides the elements of the queue
         * @protected
         * @type {Array<ElementType>}
         */
        this._elements = (elements instanceof Array) ? elements : null;

        /**
         * Provides the capacity of the queue
         * @private
         * @type {number}
         */
        this._capacity = Math.max(0, Math.min(capacity, Number.MAX_SAFE_INTEGER));
    }


    /**
     * Returns the string representation of this colleciton
     * @public
     * @exportSymbol
     * @return {string}
     */
    toString () {
        return `[object ${self.constructor.name}]`;
    }


    /**
     * Checks if the intended number of elements to add would overflow the 
     * capacity
     * @param {number} numElements
     * @throws
     */
    _throwErrorOnOutOfBounds (numElements) {
        if (this.length + numElements > this._capacity)
            throw new Error('Collection out of bounds.');
    }
}