import { EventTarget } from '../event/EventTarget';

let componentIdCount = 0;
let comoponentName2class = new Map;
let componentRegistry = new Map;
let initPromise = null;

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
     * @param {string} componentName
     */
    static associate (ctor, componentName) {
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
            if (comoponentName2class.has(key))
                console.warn(`A component class has already been associated with component name <${name}>. Will be overwritten.`);

            comoponentName2class.set(name, ctor);
        } while (names.length > 0);
    }


    /**
     * Returns the component for given element
     * @public
     * @param {Element} element
     * @return {?Component}
     */
    static getComponentByElement (element) {
        
        const componentName = element.getAttribute(Component.ATTRIBUTE_NAME);
        const key = componentName.toLowerCase();

        if (!comoponentName2class.has(key)) {
            console.warn(`No component class associated with '${componentName}'.`);
            return null;
        }

        element.id = element.id || `cmp-id-${componentIdCount++}`;

        if (componentRegistry.has(element.id))
            return componentRegistry.get(element.id);

        const ctor = comoponentName2class.get(key);
        const instance = new ctor();
        instance.element = element;
        instance.ready();
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
                promises.push(component.ready());
            });

            initPromise = Promise.all(promises);
        }

        return initPromise;
    }


    /**
     * Accessor to set the element
     * @public
     * @param {Element} element
     */
    set element (element) {
        if (this._element) {
            unregisterComponent(this);
            this._willUnsetElement();
        }

        this._element = element;
        if (this._element) {
            registerComponent(this);
            this._didSetElement();
        }
    }


    /**
     * Accessor to get the element of the component
     * @public
     * @return {?Element}
     */
    get element () {
        return this._element;
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
         * Provides the promise for initialization
         * @private
         * @type {?Promise}
         */
        this._readyPromise = null;

        /**
         * Provides the model for this component
         * @private
         * @type {Model}
         */
        this._model = null;
    }


    /**
     * Returns the promise, that resolves, when component has been initialized
     * @public
     * @return {Promise}
     */
    ready () {
        if (null == this._readyPromise) {
            const result = this._init();
            this._readyPromise = result instanceof Promise ? /** @type {Promise} */ (result) : Promise.resolve(result);
        }

        return this._readyPromise;
    }


    /**
     * Initializes the component
     * @protected
     * @return {*}
     */
    _init () {

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
    _willUnsetElement () {

    }


    /**
     * Will be called if property model is set with an element
     * @protected
     */
    _didSetElement () {

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
 * Registers a component to the component registry
 * @param {Component}
 */
function registerComponent (component) {
    if (component.element == null)
        throw new Error('You tried to register a component, that has no element set');

    component.element.id || `cmp-id-${componentIdCount++}`;
    componentRegistry.set(component.element.id, component);
}


/**
 * Unregisters a component to the component registry
 * @param {Component} component
 */
function unregisterComponent (component) {
    if (component.element == null)
        throw new Error('You tried to unregister a component, that has no element set');

    componentRegistry.delete(component.element.id);
}