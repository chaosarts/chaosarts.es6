import { Helper } from './Helper';
import { EventTarget } from '../event/EventTarget';
import { HttpRequest } from '../net/HttpRequest';

let idCount = 0;
let key2class = new Map;
let initPromise = null;
let componentRegistry = new Map;
let componentTemplate = new Map;

export class Component extends EventTarget {

    /**
     * Constant, that provides the html attribute for component identification
     * @public
     * @return {string}
     */
    static get ATTRIBUTE_NAME () {
        return 'component';
    }


    /**
     * Associates a component name with givn constructor
     * @public
     * @param {function ()}
     * @param {string} key
     */
    static associate (ctor, key) {
        let names = Array.prototype.slice.call(arguments, 1);

        if (names.length == 0) {
            console.warn('No component name specified to associate component class.');
            return;
        }

        if (!(ctor.prototype instanceof Component)) 
            throw new TypeError(`Class to associate for component names <${names.join('>, <')}> must be a subclass of Component`);

        do {
            const name = names.shift();
            const key = name.toLowerCase();
            if (key2class.has(key))
                console.warn(`A component class has already been associated with component name <${name}>. Will be overwritten.`);

            key2class.set(name, ctor);
        } while (names.length > 0);
    }


    /**
     * Returns the component class associated with given string
     * @public
     * @param {string} string
     * @return {?function ()}
     */
    static getComponentByKey (string) {
        const key = string.toLowerCase();
        if (!key2class.has(key))
            return null;

        return key2class.get(key);
    }


    /**
     * Returns the component for given element
     * @public
     * @param {Element} element
     * @return {?Component}
     */
    static getComponentByElement (element) {
        
        if (element.hasAttribute(Component.ATTRIBUTE_NAME)) {
            console.warn('Could not detect component name. Attribute in element has not been set.');
            return null;
        }

        const key = element.getAttribute(Component.ATTRIBUTE_NAME).toLowerCase();
        const ctor = Component.getComponentByKey(key);

        if (ctor == null) {
            console.warn(`No component class associated with '${key}'.`);
            return null;
        }

        element.setAttribute(Component.ATTRIBUTE_NAME, key);

        if (element.id && componentRegistry.has(element.id))
            return componentRegistry.get(element.id);

        const instance = new ctor();
        instance.element = element;

        return instance;
    }


    /**
     * Returns the component for element with given id
     * @public
     * @param {string} id
     * @return {?Component}
     */
    static getComponentById (id) {
        const element = document.getElementById(id);

        if (null == element) 
            return null;

        return Component.getComponentByElement(element);
    }


    /**
     * Initializes the component system
     * @public
     * @return {Promise}
     */
    static init () {
        if (!initPromise) {
            let elements = document.querySelectorAll(`[${Component.ATTRIBUTE_NAME}]`);
            let promises = new Array;

            Array.prototype.forEach.call(elements, function (element, index, list) {
                let component = Component.getComponentByElement(element);
                if (component == null)
                    return;
                promises.push(component.ready());
            });

            initPromise = Promise.all(promises);
        }

        return initPromise;
    }


    /**
     * Accessor to get the component key with which it has been fetched
     * @public
     * @return {string}
     */
    get key () {
        return this.element ? this.element.getAttribute(Component.ATTRIBUTE_NAME) : '';
    }


    /**
     * Accessor to set the element
     * @public
     * @param {Element} element
     */
    set element (element) {
        this.setElement(element);
    }


    /**
     * Accessor to get the element of the component
     * @public
     * @return {?Element}
     */
    get element () {
        return this.getElement();
    }


    /**
     * Accessor to get child components of this components
     * @public
     * @return {Array<Component>}
     */
    get children () {
        let children = this.element.children;
        let components = new Array;
        for (let i = 0, max = children.length; i < max; i++) {
            let component = Component.getComponentByElement(children);
            if (null != component) components.push(component);
        }

        return components;
    }

    /**
     * Accessor to set the model
     * @public
     * @param {?Model=}
     */
    set model (model = null) {
        if (this._model != null) this._willUnsetModel();
        this._model = model;
        if (this._model != null) this._didSetModel();
    }

    /**
     * Accessor to get the model of this component
     * @public
     * @return {Model} 
     */
    get model () {
        return this._model;
    }


    /**
     * Initializes the instance
     * @param {string} key
     */
    constructor() {
        super();

        /**
         * Provides the element object
         * @private
         * @type {Element}
         */
        this._element = null;

        /**
         * Provides the model for this component
         * @private
         * @type {Model}
         */
        this._model = null;

        /**
         * Provides a map of component helpers
         * @private
         * @type {Map<string, function()>}
         */
        this._helpers = new Map;

        /**
         * Provides the url to the default template
         * @protected
         * @type {string}
         */
        this._templateUrl = '';

        /**
         * Provides the template string to parse
         * @protected
         * @type {string}
         */
        this._template = null;

        /**
         * Provides the promise for initialization
         * @private
         * @type {?Promise}
         */
        this._readyPromise = null;
    }


    /**
     * Returns the promise, that resolves, when component has been initialized
     * @public
     * @return {Promise}
     */
    ready () {
        if (null == this._readyPromise) {
            if (!this.element) {
                let promise = null;
                if (this._template) promise = Promise.resolve(this._template);
                else promise = fetchTemplate(this._templateUrl).then((templateString) => parseTemplate(templateString));

                this._readyPromise = promise.then((template) => {
                    this._template = template;
                    this.element = this._template.cloneNode(true);
                    return this;
                });
            }
            else {
                this._readyPromise = Promise.resolve(this);
            }
        }

        return this._readyPromise;
    }


    /**
     * Sets the element of this component
     * @public
     * @param {?Element} element
     */
    setElement (element) {
        if (this._element) {
            unregisterComponent(this);
            this._willUnsetElement();

            this._helpers.forEach(function (helper, name, map) {
                helper.deinit(this);
            });

            this._helpers = new Map;
        }

        this._element = element;
        
        if (this._element) {
            registerComponent(this);
            this._didSetElement();

            let helperNames = [];
            if (this._element.hasAttribute('helpers')) {
                let helperNamesString = this._element.getAttribute('helpers').replace(/\s+/, ' ').trim();
                if (helperNamesString != '') {
                    helperNames = this._element.getAttribute('helpers').split(' ');
                }
            }

            while (helperNames.length > 0) {
                const helperName = helperNames.shift();
                const helper = Helper.getHelperByName(`${this.key}.${helperName}`);

                if (null == helper) {
                    console.log(`Helper '${this.key}.${helperName}' not found for component ${this.key}`);
                    continue;
                }

                this._helpers.set(helperName, helper);
                helper.init(this);
            }
        }
    }


    /**
     * Returns the element of this component
     * @public
     * @return {?Element}
     */
    getElement () {
        return this._element;
    }


    /**
     * Will be called if element has been set before and will be
     * replaced or unset. The element is still available with this.element
     * @protected
     */
    _willUnsetElement () {

    }


    /**
     * Will be called if property element is set with an element
     * @protected
     */
    _didSetElement () {

    }


    /**
     * Will be called if model has been set before and will be
     * replaced or unset. The element is still available with this.model
     * @protected
     */
    _willUnsetModel () {

    }


    /**
     * Will be called if property model is set with an element
     * @protected
     */
    _didSetModel () {

    }


    /**
     * Returns the child componentn with given id
     * @public
     * @param {string} The id string of the child element
     * @return {?Component}
     */
    getComponentById (id) {
        let element = this.element.getElementById(id);
        if (element) return Component.getComponentByElement(element);
        return null;
    }


    /**
     * Returns all child components with given tag name
     * @public
     * @param {string} tagname
     * @return {Array.<Component>}
     */
    getComponentsByTagName (tagname) {
        let elements = this.element.getElementsByTagName(tagname);
        let components = new Array;

        for (let i = 0, max = elements.length; i < max; i++) {
            const component = Component.getComponentByElement(elements[i]);
            if (component) components.push(component);
        }

        return components;
    }


    /**
     * Returns the list of child components with given class name
     * @public
     * @param {string} classname
     * @return {Array.<Component>}
     */
    getComponentsByClassName (classname) {
        let elements = this.element.getElementsByClassName(classname);
        let components = new Array;
        for (let i = 0, max = elements.length; i < max; i++) {
            const component = Component.getComponentByElement(elements[i]);
            if (component) components.push(component);
        }

        return components;
    }


    /**
     * Queries the firt element, that matches the query string, in the dom tree 
     * of this components element and returns the corresponding component.
     * @public
     * @param {string}
     * @rturn {Component}
     */
    querySelector (query) {
        let element = this.element.querySelector(query);
        if (element) return Component.getComponentByElement(element);
        return null;
    }


    /**
     * Queries all elements, that matches the query string, in the dom tree 
     * of this components element and returns the corresponding components.
     * @public
     * @param {string}
     * @rturn {Array.<Component>}
     */
    querySelectorAll (query) {
        let elements = this.element.querySelectorAll(query);
        let components = new Array;

        for (let i = 0, max = elements.length; i < max; i++) {
            const component = Component.getComponentByElement(elements[i]);
            if (component) components.push(component);
        }

        return components;
    }
}


/**
 * 
 */
function fetchTemplate (url) {
    let request = new HttpRequest;
    return request.send(url).then((event) => {
        return event;
    });
}


function parseTemplate (templateString) {
    const parser = new DOMParser();
    return parser.parseFromString(templateString, 'text/html');
}

/**
 * Registers a component to the component registry
 * @param {Component}
 */
function registerComponent (component) {
    if (component.element == null)
        throw new Error('You tried to register a component, that has no element set');

    component.element.id = component.element.id || `cmp-id-${idCount++}`;
    if (!componentRegistry.has(component.element.id))
        return;

    componentRegistry.set(component.element.id, component);
}


/**
 * Unregisters a component to the component registry
 * @param {Component} component
 */
function unregisterComponent (component) {
    if (component.element == null)
        throw new Error('You tried to unregister a component, that has no element set');

    if (!componentRegistry.has(component.element.id))
        return;

    componentRegistry.delete(component.element.id);
}