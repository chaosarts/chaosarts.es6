/**
 * Class to resolve promises
 * @template R
 * @template E
 */
export class Resolver {

    /*
     +--------------------------------------------------------------------------
     | Static getters and setters
     +--------------------------------------------------------------------------
     */

    /**
     * Represents the pending state of the resolver
     * @public
     * @return {number}
     */
    static get STATE_PENDING () {
        return 0x0;
    }

    /**
     * Represents the pending state of the resolver
     * @public
     * @return {number}
     */
    static get STATE_RESOLVED () {
        return 0x1;
    }

    /**
     * Represents the pending state of the resolver
     * @public
     * @return {number}
     */
    static get STATE_REJECTED () {
        return 0x2;
    }


    /*
     +--------------------------------------------------------------------------
     | Getters and setters
     +--------------------------------------------------------------------------
     */

    /**
     * Accessor to get the containing promise
     * @public
     * @return {Promise.<R>|Promise.<E>}
     */
    get promise () {
        return this._promise;
    }

    /**
     * Accessor to get the state of the resolver
     * @public
     * @return {number}
     */
    get state () {
        return this._state;
    }

    /**
     * Indicates whether the resolver is still pending or not
     * @public
     * @return {boolean}
     */
    get pending () {
        return this._state == Resolver.STATE_PENDING;
    }

    /**
     * Indicates whether the resolver has been resolved or not
     * @public
     * @return {boolean}
     */
    get resolved () {
        return this._state == Resolver.STATE_RESOLVED;
    }

    /**
     * Indicates whether the resolver has been resolved or not
     * @public
     * @return {boolean}
     */
    get rejected () {
        return this._state == Resolver.STATE_REJECTED;
    }

    /**
     * Indicates, whether the resolver has been completed by method resolve or 
     * reject.
     * @public
     * @return {boolean}
     */
    get complete () {
        return this._state != Resolver.STATE_PENDING;
    }

    constructor () {

        /**
         * Provides the function to resolve the promise
         * @private
         * @type {function (R=)}
         */
        this._resolve = null;

        /**
         * Provides the function to reject the promise
         * @private
         * @type {function (E=)}
         */
        this._reject = null;

        /**
         * Provide the promise
         * @private
         * @type {Promise} 
         */
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        /**
         * Provides the state of the resolver
         * @private
         * @type {number}
         */
        this._state = Resolver.STATE_PENDING;
    }


    /**
     * Resolves the containing promise
     * @public
     * @param {R=} result The result to resolve the promise with
     */
    resolve (result = null) {
        this._complete(Resolver.STATE_RESOLVED, result);
    }


    /**
     * Rejects the containing promise with given reason
     * @public
     * @param {E=} reason The reason of rejection
     */
    reject (reason = null) {
        this._complete(Resolver.STATE_REJECTED, reason);
    }


    /**
     * Completes the resolver to given state
     * @private
     * @param {number} state
     * @param {(R|E)=} param
     * @throws If resolver has already been completed or an invalid state has 
     * been passed
     */
    _complete (state, param = null) {
        if (this.complete) 
            throw new Error('Cannot complete resolver, since it has already been completed.');

        switch (state) {
            case Resolver.STATE_RESOLVED:
                this._resolve(param);
                break;
            case Resolver.STATE_REJECTED:
                this._reject(param);
                break;
            default:
                throw new TypeError('Invalid state change of Resolver.');
        }

        this._state = state;
    }
}