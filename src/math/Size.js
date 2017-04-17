export class Size {

    /**
     * Accessor to get the area of the size
     * @public
     * @return {number}
     */
    get area () {
        return this.width * this.height;
    }

    /**
     * Creates a new size
     * @param {number} width
     * @param {number} height
     */
    constructor (width, height) {
        
        /**
         * Provides the width component of the point
         * @public
         * @type {number}
         */
        this.width = width;
        
        /**
         * Provides the height component of the point
         * @public
         * @type {number}
         */
        this.height = height;
    }


    /**
     * Clones the point
     * @public
     * @return {Point}
     */
    clone () {
        return new Point(this.width, this.height);
    }
}