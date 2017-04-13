let key2class = new Map();

export class Helper {

    /**
     * Associates a helper class with given helper names
     * @public
     * @param {function ()}
     * @param {...string}
     */
    static associate (ctor, helperName) {
        let args = Array.prototype.slice.call(arguments, 1);

        if (args == 0) {
            console.warn('No name given to associate helper class');
            return;
        }

        if (!(ctor.prototype instanceof Helper)) {
            console.warn(`Class to associate with helper names '${args.join('\', \'')}> must be a subclass of Helper.`);
            return;
        }

        do {
            const name = args.shift();
            const key = name.toLowerCase();

            if (key2class.has(key))
                console.warn(`A helper class has already been associated with helper name <${name}>. Will be overwritten.`);

            key2class.set(key, ctor);
        } while(args.length > 0)
    }


    /**
     * Returns the helper associated with given name. Each helper class will be
     * instatiated only once.
     * @public
     * @param {string} name
     * @return {?Helper}
     */
    static getHelperByName (name) {
        const key = name.toLowerCase();
        if (!key2class.has(key)) {
            console.warn(`No helper found for name ${name}`);
            return null;
        }

        const ctor = key2class.get(key);
        return new ctor();
    }


    /**
     * Accessor to get the name with which the helper has been associated
     * @public
     * @return {string}
     */
    get name () {
        return this._name;
    }


    /**
     * Accessor to get the component to help
     * @public
     * @return {comopnent}
     */
    get component () {
        return this._component;
    }


    /**
     * Accessor to indicate whether the helper has been initialized or not
     * @public
     * @return {boolean} 
     */
    get initialized () {
        return this._initPromise != null;
    }


    get burntOut () {
        return this._component == null;
    }


    /**
     * Creates a new instance of helper class
     * @param {string} name
     * @param {Component} component
     */
    constructor (name, component) {

        /**
         * Provides the name with which this helper has been associated
         * @private
         * @type {string}
         */
        this._name = name;

        /**
         * The component to help
         * @private
         * @type {Component}
         */
        this._component = component;

        /**
         * Indicates whether the helper has been initialized or not
         * @private
         * @type {Promise}
         */
        this._initPromise = null;


        this._deinitPromise = null;
    }


    /**
     * Initializes the helper
     * @public
     * @param {Component} component
     * @param {string} helperName
     */
    init () {

        if (!this._initPromise) {
            if (this.burntOut) {
                this._initPromise = Promise.reject(`Helper ${this._name} is burnt out.`);
            }
            else {
                try {
                    const result = this._init();
                    this._initPromise = result instanceof Promise ? /** @type {Promise} */ (result) : Promise.resolve(result);
                }
                catch (error) {
                    this._initPromise = Promise.reject(error);
                }
            }
        }

        return this._initPromise;
    }


    /**
     * Reverts the init function
     * @public
     * @param {Component} component
     * @param {string} helperName
     */
    deinit () {
        if (!this._deinitPromise) {
            try {
                const result = _deinit();
                this._deinitPromise = result instanceof Promise ? /** @type {Promise} */ (result) : Promise.resolve(result);
            }
            catch (error) {
                this._deinitPromise = Promise.resolve(`Could not deinitialize helper ${this._name}: ${error.message}`);
            }

            this._component = null;
            this._initPromise = null;
        }

    }


    _init () {
        throw new Error('Subclass of Helper for Component must implement setup()');
    }


    _deinit () {
        throw new Error('Subclass of Helper for Component must implement cease()');
    }
}