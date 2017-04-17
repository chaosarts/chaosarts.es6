import { Point } from './Point';
import { Size } from './Size';

export class Rect {

    /**
     * Creates a new rect from given point and size
     * @public
     * @param {Point} point
     * @param {Size} size
     */
    static fromSizeAndPoint (size, point) {
        return new Rect(size.width, size.height, point.x, point.y);
    }

    /**
     * Accessor to get the x component of the rect
     * @public
     * @return {number}
     */    
    get x () {
        return this._point.x;
    }

    /**
     * Accessor to set the x coordinate of the rect
     * @public
     * @param {number} y
     */
    set x (x) {
        this._point.x = x;
    }

    /**
     * Accessor to get the y component of the rect
     * @public
     * @return {number}
     */        
    get y () {
        return this._point.y;
    }

    /**
     * Accessor to set the y coordinate of the rect
     * @public
     * @param {number} y
     */
    set y (y) {
        this._point.y = y;
    }

    /**
     * Accessor to get the width component of the rect
     * @public
     * @return {number}
     */        
    get width () {
        return this._size.width;
    }

    /**
     * Accessor to set the width of the rect
     * @public
     * @param {number} width
     */
    set width (width) {
        this._size.width = width;
    }

    /**
     * Accessor to get the height component of the rect
     * @public
     * @return {number}
     */        
    get height () {
        return this._size.height;
    }

    /**
     * Accessor to set the width of the rect
     * @public
     * @param {number} height
     */
    set height (height) {
        this._size.height = height;
    }

    /**
     * Accessor to get the area of the rect
     * @public
     * @return {number}
     */
    get area () {
        return this._size.area;
    }


    /**
     * Creates a new size
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    constructor (width, height, x = 0, y = 0) {
        
        /**
         * Provides the upper left corner of the rect
         * @private 
         * @type {Point}
         */
        this._point = new Point(x, y);
        
        /**
         * Provides the size of the rect
         * @private
         * @type {Size}
         */
        this._size = new Size(width, height);
    }


    /**
     * Clones the rect
     * @public
     * @return {Rect}
     */
    clone () {
        return new Rect(this.x, this.y, this.width, this.height);
    }


    intersection (rect) {
        
    }
}