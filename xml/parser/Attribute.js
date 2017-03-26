import { Parser } from '../../core/Parser';

/**
 * Provides the type to class map
 * @type {Map.<string, function (attribute, type)>}
 */
let type2class = new Map;

/**
 * @type {Array.<Attribute>}
 */
let attr2instance = new Map;


/**
 * Base class for xml attribute parsers
 */
export class Attribute extends Parser {

    /**
     * Registers an Attribute class to given type, presented as string
     * @param {function (Attr, string)} ctor The class constructor
     * @param {string} type An identifier, to associate a type with the 
     * attribute parser
     * @throws If ctor is not a subclass of Attribute
     */
    static associate (ctor, type) {
        let typeStrings = Array.prototype.slice.call(arguments, 1);
        if (typeStrings.length > 0) {
            while (typeStrings.length > 0) {
                const typeString = typeStrings.shift();
                const key = typeString.toLowerCase();

                if (!(ctor.prototype instanceof Attribute))
                    throw new TypeError(`Class for attribute type associations [${typeStrings.join('], [')}] must extend Attribute.`);

                if (type2class.has(key))
                    console.warn(`Already set type association '${typeString}' will be overwritten.`);

                type2class.set(key, ctor);
            }
        }
        else {
            console.warn('No type string passed to register Attribute class.');
        }
    }


    /**
     * Returns an instance of the Attribute subclass associated with given
     * type. This will create an instance only once for the same Attr instance.
     *
     * @param {Attr} attribute
     * @param {string} type The type string
     * @return {Attribute}
     */
    static get (attribute, type) {
        const classKey = type.toLowerCase();
        const instanceKey = `${attribute.name}:${classKey}=${attribute.value}`
        let instance = null;

        if (!attr2instance.has(instanceKey)) {

            if (!type2class.has(classKey))
                throw new TypeError(`No attribute parser found for type '${type}'`);

            const ctor = type2class.get(classKey);
            instance = new ctor(attribute, type);
            attr2instance.set(instanceKey, instance);
        }
        else {
            instance = attr2instance.get(instanceKey);
        }

        return instance;
    }


    /**
     * Accessor to get the Attr object to parse
     * @public
     * @return {Attr}
     */
    get attribute () {
        return /** @type {Attr} */ (this.data);
    }

    /**
     * Accessor to get the name of the attribute
     * @public
     * @return {string}
     */
    get name () {
        return this.attribute.name;
    }

    /**
     * Accessor to get the raw value of the attribute
     * @public
     * @return {string}
     */
    get value () {
        return this.attribute.value;
    }

    /** 
     * Accessor to get the type string, with whcih it has been initialized
     * @type {string}
     */
    get type () {
        return this._type;
    }


    /**
     * Returns the base uri of the attribute
     * @return {string}
     */
    get baseURI () {
        return this.ownerDocument ? this.ownerDocument.baseURI : this.attribute.baseURI;
    }


    /**
     * Initializes the Attribute
     * @param {Attr} attribute
     * @param {string} type
     */
    constructor (attribute, type) {
        super(attribute);

        /**
         * Provides the document parser, to which this element parser belongs
         * @public
         * @type {Document}
         */
        this.ownerDocument = null;

        /**
         * Provides the type with which it was created
         * @private
         * @type {string}
         */
        this._type = type;
    }


    _process () {
        this._preConstruct();
        const result = this._construct();

        let promise = null;
        if (result instanceof Promise) promise = /** @type {Promise} */ (result);
        else promise = Promise.resolve(result);

        return promise.then(result => this._postConstruct());
    }


    _preConstruct () {}


    _construct () {
        throw new TypeError('Subclass of ca.xml.parser.Attribute must implement method _construct()');
    }


    _postConstruct () {}
}