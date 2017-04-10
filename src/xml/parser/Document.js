import { Parser } from '../../core/Parser';
import { Element } from './Element';

/**
 *
 */
export class Document extends Parser {

    /**
     * Accessor to get the containing document
     * @public
     * @return {Document}
     */
    get doc () {
        return /** @type {Document} */ (this.data);
    }


    /**
     * Accessor to get the base uri of the document
     * @public
     * @return {string}
     */
    get baseURI () {
        return this._baseURI;
    }


    get rootElementParser () {
        return this._rootElementParser;
    }


    /**
     * Initializes the Document
     * @param {Document} doc
     * @param {string=} baseURI The base uri of the document
     */
    constructor (doc, baseURI = null) {
        super(doc);

        /**
         * Provides the base uri of the document
         * @public
         * @type {string}
         */
        this._baseURI = baseURI || doc.baseURI || window.location.toString();

        /**
         * Provides the root element parser
         * @private
         * @type {?Element}
         */
        this._rootElementParser = null;
    }


    /**
     * @overrides
     */
    _process () {
        this._rootElementParser = Element.get(this.doc.firstChild);
        this._rootElementParser.parent = this;
        this._rootElementParser.ownerDocument = this;
        return this._rootElementParser.process();
    }
}