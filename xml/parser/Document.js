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
    }


    /**
     * @overrides
     */
    _process () {
        let parser = Element.get(this.doc.firstChild);
        parser.parent = this;
        parser.ownerDocument = this;
        return parser.process();
    }
}