export class Point {

    /**
     * Creates a new size
     * @param {number} x
     * @param {number} y
     */
    constructor (x = 0, y = 0) {
        
        /**
         * Provides the x component of the point
         * @public
         * @type {number}
         */
        this.x = x;
        
        /**
         * Provides the y component of the point
         * @public
         * @type {number}
         */
        this.y = y;
    }


    /**
     * Clones the point
     * @public
     * @return {Point}
     */
    clone () {
        return new Point(this.x, this.y);
    }
}