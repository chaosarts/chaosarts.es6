import { Collection } from './Collection';

/**
 * @template ElementType
 * @extends Collection<ElementType>
 */
export class Stack extends Collection {

    /** 
     * Accessor to get the element on top of the stack
     * @public
     * @return {?ElementType}
     */
    get top () {
        if (this.isEmpty) {
            return undefined;
        }

        return this._elements[this.length - 1];
    }


    /**
     * Pushes the element on top of the stack and returns the new count of 
     * elements.
     * @public
     * @param {Element} element
     * @return {number}
     */
    push (element) {
        this._elements.push(element);
        return this._elements.length;
    }


    /** 
     * Pops the top element of the stack
     * @public
     * @return {Element} 
     */
    pop () {
        return this._elements.pop();
    }
}