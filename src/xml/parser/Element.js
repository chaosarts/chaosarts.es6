import { Parser } from '../../core/Parser';
import { Resolver } from '../../core/Resolver';
import { Attribute } from './Attribute';
import * as attr from './attr';

const ATTRIB_FLAG_AUTOASSIGN = 0x1;
const ATTRIB_FLAG_FORWARD = 0x2;

let tagname2class = new Map;
let instanceValues = new Array;
let instanceKeys = new Array;

export class Element extends Parser {

    /**
     * Associates an element parser class with a given tagname
     * @public
     * @param {function (window.Element)} ctor
     * @param {string} tagname
     */
    static associate (ctor, tagname) {
        let tagnames = Array.prototype.slice.call(arguments, 1);

        if (tagnames.length == 0) 
            throw new Error('No tag names given to associate for Element parser class.');

        if (!(ctor.prototype instanceof Element))
            throw new TypeError(`Class to associate for tagnames <${tagnames.join('>, <')}> is not a subclass of chaosarts/parser/xml/Element`);

        do {
            const tagname = tagnames.shift();
            const key = tagname.toLowerCase();
            if (tagname2class.has(key)) 
                console.warn(`Parser for <${tagname}> has already been associated with another parser class. Will be overwritten.`);

            tagname2class.set(key, ctor);
        } while (tagnames.length > 0);
    }


    /**
     * Returns the parser instance of given element. The same element will 
     * always return the same parser instance.
     * @public
     * @param {window.Element} element
     * @return {Element}
     * @throws {TypeError}
     */
    static get (element) {
        let index = instanceKeys.indexOf(element);
        let instance = null;

        if (index < 0) {
            const key = element.tagName.toLowerCase();

            if (!tagname2class.has(key)) 
                throw new TypeError(`Parser class for element <${element.tagName}> not found.`);

            const ctor = tagname2class.get(key);
            instance = new ctor(element);

            instanceKeys.push(element);
            instanceValues.push(instance);
        }
        else {
            instance = instanceValues[index];
        }

        return instance;
    }


    /**
     * Accessor to get the element
     * @public
     * @return {Element}
     */
    get element () {
        return /** @type {Element} */ (this.data);
    }


    /**
     * Returns the base uri of the element
     * @public
     * @return {string}
     */
    get baseURI () {
        if (this.ownerDocument)
            return this.ownerDocument.baseURI;

        return this.baseURI || this.element.baseURI;
    }


    /**
     * Accessor to get the child parsers
     * @public
     * @return {Array.<Element>}
     */
    get children () {
        const children = this.element.childNodes;
        let parsers = new Array;
        for (let i = 0, max = children.length; i < max; i++)
            parsers.push(Element.get(children[i]));

        return parsers;
    }


    /**
     * Initializes the Element
     * @param {Element} element
     * @param {string=} baseURI
     */
    constructor (element, baseURI = null) {
        super(element);

        /**
         * Provides the document parser, to which this element parser belongs
         * @public
         * @type {Document}
         */
        this.ownerDocument = null;

        /**
         * Provides the baseURI of the element
         * @private
         * @type {string} 
         */
        this._baseURI = baseURI || '';

        /**
         * Provides a mapping from attribute name to type string
         * @private
         * @type {Map.<string, string>}
         */
        this._attribDefinitions = new Map;

        /**
         * Provides the attribute name to value map
         * @private
         * @type {Map.<string, *>}
         */
        this._attribValues = new Map;

        /**
         * Stores for each attribute definition a bitmask.
         * - Bit 1: Auto assignemnt
         * - Bit 2: Forward assignemnt
         * @private
         * @type {Map.<string, number>}
         */
        this._attribFlags = new Map;

        /**
         * Provides the attribute parser queue
         * @private
         * @type {number}
         */
        this._attributeQueueIndex = 0;

        /**
         * Provides the queue of child element parsers
         * @private
         * @type {number}
         */
        this._childElementQueueIndex = 0;
    }


    /** @inheritDoc */
    _process () {
        return this._processAttributes()
            .then(() => this._processChildElements())
            .then(() => this._processElement());
    }


    /**
     * Defines which attribute parser to use
     *
     * @public
     * @param {string} attributeName The name of the attribute to define
     * @param {string} attributeType The type of the attribute indicating the 
     * parser, which is associated with this type
     * @param {boolean} auto Indicates, whether to assign the attribute result
     * automatically to the result object as property or not
     * @param {boolean} forward Indicates, whether to forward the attribute 
     * value to the child element parser or not
     */
    defineAttribute (attributeName, attributeType, auto = true, forward = false) {
        this._attribDefinitions.set(attributeName, attributeType.trim().toLowerCase());
        this._attribFlags.set(attributeName, !!auto * ATTRIB_FLAG_AUTOASSIGN + !!forward * ATTRIB_FLAG_FORWARD);
    }


    /**
     * Sets an value for an attribute directly to this parser
     * @public
     * @param {string} name
     * @param {string} value
     */
    setAttribute (name, value) {
        this._attribValues.set(name, value);
    }


    /**
     * Determines, whether an attribute has been set or not
     * @public
     * @param {string} name
     * @return {boolean}
     */
    hasAttribute (name) {
        return this._attribValues.has(name);
    }


    /**
     * Returns the parsed value of the attribute
     * @public
     * @param {string} name
     * @param {*} defaultValue A value, that will be returned, if the attribute 
     * has not been set
     * @return {*}
     */
    getAttribute (name, defaultValue = undefined) {
        return this._attribValues.get(name) || defaultValue;
    }


    /**
     * Returns the parser corresponding to the element, that results from
     * querySelector(selector) of this element.
     * @public
     * @param {string} selector A valid css selector
     * @return {?Element}
     */
    querySelector (selector) {
        let element = this.element.querySelector(selector);
        let parser = null;
        if (element) parser = Element.get(element);
        return parser;
    }


    /**
     * Returns a list of element parsers corresponding to the elements, that
     * result from querySelectorAll of this dom element.
     * @public
     * @param {string} selector
     * @return {Array.<Element>}
     */
    querySelectorAll (selector) {
        let elements = this.element.querySelectorAll(selector);
        let parsers = new Array;

        for (let i = 0, max = elements.length; i < max; i++)
            parser.push(Element.get(elements[i]));

        return parsers;
    }


    /**
     * Returns the child parser corresponding to the element, that results from
     * getElementById(id) of this dom element.
     * 
     * @public
     * @param {string} id A valid dom id value
     * @return {?Element}
     */
    getParserById (id) {
        let element = this.element.getElementById(id);
        let parser = null;
        if (element) parser = Element.get(element);
        return parser;
    }


    /**
     * Returns a list of element parsers corresponding to the elements, that
     * result from querySelectorAll of this dom element.
     * @public
     * @param {string} tagname
     * @return {Array.<Element>}
     */
    getParsersByTagName (tagname) {
        let elements = this.element.getElementsByTagName(tagname);
        let parsers = new Array;

        for (let i = 0, max = elements.length; i < max; i++)
            parser.push(Element.get(elements[i]));

        return parsers;
    }


    /**
     * Returns a list of element parsers corresponding to the elements, that
     * result from querySelectorAll of this dom element.
     * @public
     * @param {string} tagname
     * @return {Array.<Element>}
     */
    getParsersByClassName (classname) {
        let elements = this.element.getElementsByClassName(classname);
        let parsers = new Array;

        for (let i = 0, max = elements.length; i < max; i++)
            parser.push(Element.get(elements[i]));

        return parsers;
    }


    /**
     * Invokes the parser to process the attributes
     * @return {Promise}
     */
     _processAttributes () {
        this._preprocessAttributes();
        return this._processNextAttribute()
            .then(() => this._postProcessAttributes());
     }


     /** 
      * Invokes the parser to process next attribute in list
      * @return {Promise}
      */
    _processNextAttribute () {

        if (this.element.attributes.length == this._attributeQueueIndex)
            return Promise.resolve();

        const attribute = this.element.attributes[this._attributeQueueIndex++];
        
        /// Default processing
        /// ++++++++++++++++++

        let promise = null;
        const type = this._attribDefinitions.get(attribute.name) || 'string';
        if (type == 'string') {
            this.setAttribute(attribute.name, attribute.value);
            promise = Promise.resolve();
        }
        else {
            /// Delayed proccessing
            /// +++++++++++++++++++

            const resolver = new Resolver;
            const parser = Attribute.get(attribute, type);
            parser.parent = this;
            parser.ownerDocument = this.ownerDocument;

            setTimeout(() => {
                parser.process()
                    .catch((reason) => {
                        console.warn(reason);
                        return parser;
                    })
                    .then((parser) => {
                        this.setAttribute(attribute.name, parser.result)
                        resolver.resolve();
                    });
            }, 0);

            promise = resolver.promise;
        }


        return promise.then(() => {
            return this._processNextAttribute();
        });
    }


    /**
     * Will be called, before attributes will be processed
     * @protected
     */
    _preprocessAttributes () {}


    /** 
     * Will be called, after all attributes had been processed
     * @protected
     */
    _postProcessAttributes () {}


    /**
     * Invokes to parser to process child elements
     * @private
     * @return {Promise}
     */
    _processChildElements () {
        return this._processNextChildElement();
    }


    /**
     * Processes the next element in list. Before processing, all flagged 
     * attributes are forwarded to the child parser. The parser will be invoked
     * to process with a delay of one application loop.
     * @private
     * @return {Promise}
     */
    _processNextChildElement () {

        if (this.element.children.length <= this._childElementQueueIndex)
            return Promise.resolve();


        /// Fetch parser
        /// ++++++++++++

        const element = this.element.children[this._childElementQueueIndex++];
        let parser = Element.get(element);

        parser.parent = this;
        parser.ownerDocument = this.ownerDocument;


        /// Froward attributes
        /// ++++++++++++++++++

        this._attribFlags.forEach((flag, attributeName, map) => {
            if (flag & ATTRIB_FLAG_FORWARD != 0 && this.hasAttribute(attributeName))
                parser.setAttribute(attributeName, this.getAttribute(attributeName));
        });


        /// Invoke delayed proccessing
        /// ++++++++++++++++++++++++++

        const resolver = new Resolver;

        setTimeout(() => {
            parser.process()
                .catch((reason) => console(reason))
                .then(() => resolver.resolve());
        }, 0);

        return resolver.promise.then(() => this._processNextChildElement());
    }


    /**
     * Processes the element
     * @private
     * @return {Promise}
     */
    _processElement () {
        const result = (this._construct());

        let promise = null;
        if (!(result instanceof Promise)) {
            promise = Promise.resolve(result);
        }
        else {
            promise = /** @type {Promise} */ (result);
        }

        return promise.then(result => {
            result = this._postConstruct(result);
            return result;
        });
    }


    /**
     * Constructs the result object for this parser. Default result is a 
     * standard object.
     * 
     * @protected
     * @return {(Promise|object)?}
     */
    _construct () {
        return {};
    }


    /**
     * Will be called, when parser is done parsing its element
     * @protected
     * @param {*}
     * @return {*}
     */
    _postConstruct (obj) {
        return obj;
    }
}