import { lt, le, ge, gt, includes } from './fn';

export class Range {

    /**
     * Represents the type for a closed range
     * @public
     * @return {number}
     */
    static get CLOSED () {
        return 0;
    }

    /**
     * Represents the type for a half opened range
     * @public
     * @return {number}
     */
    static get LEFT_OPEN () {
        return 1;
    }

    /**
     * Represents the type for a half opened range
     * @public
     * @return {number}
     */
    static get RIGHT_OPEN () {
        return 2;
    }

    /**
     * Represents the type for a open range
     * @public
     * @return {number}
     */
    static get OPEN () {
        return 3;
    }

    /**
     * Accessor to get the min value of this range
     * @public
     * @return {number}
     */
    get min () {
        return this._min;
    }

    /**
     * Accessor to get the max value of this range
     * @public
     * @return {number}
     */
    get max () {
        return this._min;
    }

    /**
     * Accessor to get the type of this range
     * @public
     * @return {number}
     */
    get type () {
        return this._type;
    }

    /**
     * Accessor to set the type of this range
     * @public
     * @param {number}
     */
    set type (type) {
        this._type = type;
    }


    /**
     * Creates a new range
     * @public
     * @param {number} max
     * @param {number} min
     * @param {number} min
     */
    constructor (max, min = 0, type = Range.CLOSED) {

        /**
         * Provides the min value of the range
         * @private
         * @type {number}
         */
        this._min = Math.min(min, max);

        /**
         * Provides the max value of the range
         * @private
         * @type {number}
         */
        this._max = Math.max(min, max);

        /**
         * Provides the compare function
         * @private
         * @type {function (number, number):boolean}
         */
        this._minCmp = le;

        /**
         * Provides the compare function
         * @private
         * @type {function (number, number):boolean}
         */
        this._maxCmp = ge;

        /**
         * Provides the type of the range
         * @private
         * @type {number}
         */
        this._type = type;
    }


    /**
     * Determines if the given value is in range
     * @public
     * @param {number} value
     */
    includes (value) {
        return includes(value, this._min, this._max, this._type);
    }
}