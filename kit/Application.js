import { Resolver } from '../core/Resolver';
import { HttpRequest } from '../net/HttpRequest';
import { Component } from '../ui/Component';
import { Document } from '../xml/parser/Document';
import { Manifest } from './parser/Manifest';

/**
 * Provides the singleton instance
 * @private
 * @type {Application}
 */
let instance = null;

/**
 * Application class
 */
export class Application {

    /**
     * Static accessor to get the singleton instance of Application class
     * @public
     * @return {Application}
     */
    static get instance () {
        if (instance == null)
            instance = new Application;

        return instance;
    }

    /**
     * Accessor to get the name of the application
     * @public
     * @return {string}
     */
    get name () {
        return this._name;
    }

    /**
     * Accessor to get the element
     * @public
     * @return {Element}
     */
    get element () {
        return this._element;
    }


    /**
     * Creates an instance of Application
     * @private
     */
    constructor () {

        /**
         * The name of the application
         * @private
         * @type {string}
         */
        this._name = '';

        /**
         * Provides the element of the application
         * @private
         * @type {Element}
         */
        this._element = null;

        /**
         * Provides the promise for bootstrap
         * @private
         * @type {?Promise}
         */
        this._bootstrapPromise = null;

        /**
         * Provides the resolver for run
         * @private
         * @type {Resolver}
         */
        this._runResolver = null;

        /**
         * Provides the application delegate
         * @private
         * @type {AppDelegate}
         */
        this._delegate = null;
    }

    
    /**
     * Bootstrap the application
     * @public
     * @param {string} manifest
     * @return {Promise}
     */
    bootstrap (manifest) {
        if (null == this._bootstrapPromise) {

            this._bootstrapPromise = Component.init().then(() => {
                let request = new HttpRequest;
                return request.send(manifest, null, {
                    'mimetype': 'text/xml'
                })
                .then((event) => {
                    return this.onResolveManifestLoad(/** @type {XMLHttpRequest} */ (event.target))
                });
            })
        }

        return this._bootstrapPromise;
    }


    /**
     * Runs the application
     * @public
     * @return {Promise}
     */
    run () {
        if (null == this._bootstrapPromise) 
            throw new Error('Application has not been bootstrapped yet.');

        if (null == this._runResolver) {
            this._runResolver = new Resolver;

            try {
                this._delegate.applicationDidFinishLaunching();
            }
            catch (error) {
                this._runResolver.reject(error);
            }
        }

        return this._runResolver.promise;
    }


    /**
     * Terminates the application
     * @public
     */
    terminate () {
        try {
            let result = this._delegate.applicationWillTerminate();
            let promise = result instanceof Promise ? /** @type {Promise} */ (result) : Promise.resolve(result);
            return promise.then(() => this._runResolver.resolve());
        }
        catch (error) {
            this._runResolver.resolve();
        }
    }


    /**
     * Handles the event, when manifest has been loaded
     * @public
     * @param {XMLHttpRequest} xhr
     */
    onResolveManifestLoad (xhr) {
        let parser = new Document(xhr.responseXML, xhr.responseURL);
        return parser.process().then((parser) => {
            this._name = parser.getAttribute('name');
            this._element = document.getElementById(this._name);
            return this.onResolveManifestProcessed(/** @type {AppDelegate} */ (parser.result))
        });
    }


    onResolveManifestProcessed (delegate) {
        this._delegate = delegate;
        return this._delegate.applicationWillLaunch();
    }
}