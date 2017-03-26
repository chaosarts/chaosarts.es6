/**
 * Base class for parser
 * @template D
 * @template R
 */
export class Parser {

    /**
     * Accessor to get the data, which will be parsed by the parser
     * @public
     * @return {D}
     */
    get data () {
        return this._data;
    }

    /**
     * Accessor to get the result of the parsing process
     * @public
     * @return {R}
     */
    get result () {
        if (!this._processPromise)
            console.warn('Parser has not proccessed data yet.');

        return this._result;
    }


    /**
     * Initializes the parser with the data to parse
     * @param {D} data
     */
    constructor (data) {

        /**
         * Provides the parent parser of this parser
         * @public
         * @type {Parser}
         */
        this.parent = null;

        /**
         * Provides the data, is to parse
         * @private
         * @type {D}
         */
        this._data = data;

        /**
         * Provides the result of the parser
         * @private
         * @type {R}
         */
        this._result = null;

        /**
         * The promise that resolves, when parser is done processing
         * @private
         * @type {Promise.<Resolver.<R>>}
         */
        this._processPromise = null;
    }


    /**
     * Starts the parser to process the data
     * @public
     * @return {Promise.<Resolver.<R>>}
     */
    process () {
        if (!this._processPromise) {
            try {
                const result = this._process();
                if ((result instanceof Promise)) this._processPromise = result;
                else this._processPromise = Promise.resolve(result);
            }
            catch (error) {
                this._processPromise = Promise.reject(error);
            }

            this._processPromise = this._processPromise.then(result => {
                this._result = result;
                return this;
            });
        }

        return this._processPromise;
    }


    /**
     * Internal parse process.
     * @return {R|Promise.<R>}
     */
    _process () {
        throw new Error('Subclass of Parser must implement method _process');
    }
}