import { extend } from '../core/fn';
import { Resolver } from '../core/Resolver';
import { EventTarget } from '../event/EventTarget';

export class HttpRequest extends EventTarget {

    /**
     * Creates a new HttpRequest object
     */
    constructor () {

        super();

        /**
         * Provides the native xhr object
         * @private
         * @type {XMLHttpRequest}
         */
        this._xhr = new XMLHttpRequest;
    }


    /**
     * Sends the request to given url
     * @public
     * @param {string} url
     * @param {?(ArrayBuffer|Blob|Document|DOMString|FormData)=} data
     * @param {options}
     * @return {Promise}
     */
    send (url, data = null, options = {}) {
        extend(options, {
            'method': 'GET',
            'user': '',
            'password': '',
            'mimetype': null,
            'headers': {}
        });

        this._xhr.open(options['method'], url, true, options['user'], options['password']);
        if (options['mimetype']) this._xhr.overrideMimeType(options['mimetype']);

        let resolver = new Resolver;
        this._xhr.addEventListener('abort', (event) => resolver.reject(event));
        this._xhr.addEventListener('error', (event) => resolver.reject(event));
        this._xhr.addEventListener('timeout', (event) => resolver.reject(event));
        this._xhr.addEventListener('load', (event) => resolver.resolve(event));

        for (let key in options) 
            this._xhr.setRequestHeader(key, options[key]);
        
        this._xhr.send(data);
        return resolver.promise;
    }


    /**
     * Aborts the request
     * @public
     */
    abort () {
        this._xhr.abort();
    }
}