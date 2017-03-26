import { Collection } from './Collection';

/**
 * @template ElementType
 * @extends Collection<ElementType>
 */
export class Queue extends Collection {

    /**
     * Accessor to get the first element in queue
     * @public
     * @return {?ElementType}
     */
    get head () {
        return this.isEmpty ? undefined : this._elements[0];
    }

    /**
     * Accessor to get the last element in queue
     * @public
     * @return {?ElementType}
     */
    get tail () {
        return this.isEmpty ? undefined : this._elements[this._elements.length - 1];
    }


    /**
     * @public
     * @param {Array<ElementType>=}
     */
    constructor (elements = null, capacity = 0) {
        super(elements, capacity);
    }


    /**
     * Enqueues one or more elements
     * @public
     * @type {(E|Array<ElementType>|Collection<ElementType>)...}
     * @throws
     */
    enqueue (element) {
        while (arguments.length > 0) {
            let arg = Array.prototype.shift.call(arguments);
            switch (true) {
                case arg instanceof Collection:
                    arg = arg.array;
                case arg instanceof Array:
                    this._throwErrorOnOutOfBounds(arg.length);
                    this._elements = this._elements.concat(arg);
                    break;
                default:
                    this._throwErrorOnOutOfBounds(1);
                    this._elements.push(arg);
                    break;
            }
        }
    }


    /**
     * Dequeues the top element and returns it
     * @public
     * @return {ElementType}
     */
    dequeue () {
        if (this.isEmpty) {
            return undefined;
        }

        return this._elements.shift();
    }
}