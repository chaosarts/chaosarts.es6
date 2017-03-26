import { Element } from '../../../xml/parser/Element';
import { Boolean } from '../../../xml/parser/attr/Boolean';
import { Constructor } from '../../../xml/parser/attr/Constructor';
import { Image } from '../../../xml/parser/attr/Image';
import { Instance } from '../../../xml/parser/attr/Instance';
import { Number } from '../../../xml/parser/attr/Number';

/**
 * Xml parser class for display objects
 */
class DisplayObject extends Element {

    constructor (element) {
        super(element);

        this.defineAttribute('alpha', 'number', true);
        this.defineAttribute('cacheID', 'number', true);
        this.defineAttribute('compositeOperation', 'string', true);
        this.defineAttribute('cursor', 'string', true);
        this.defineAttribute('filters', 'array', true);
        this.defineAttribute('id', 'number', true);
        this.defineAttribute('mouseEnabled', 'bool', true);
        this.defineAttribute('name', 'string', true);
        this.defineAttribute('regX', 'number', true);
        this.defineAttribute('regY', 'number', true);
        this.defineAttribute('reg', 'number', false);
        this.defineAttribute('rotation', 'number', true);
        this.defineAttribute('scaleX', 'number', true);
        this.defineAttribute('scaleY', 'number', true);
        this.defineAttribute('scale', 'number', false);
        this.defineAttribute('skewX', 'number', true);
        this.defineAttribute('skewY', 'number', true);
        this.defineAttribute('snapToPixel', 'bool', true);
        this.defineAttribute('tickEnabled', 'bool', true);
        this.defineAttribute('transformMatrix', 'array', true);
        this.defineAttribute('visible', 'bool', true);
        this.defineAttribute('lazy', 'bool', true);
        this.defineAttribute('x', 'number', true);
        this.defineAttribute('y', 'number', true);
        this.defineAttribute('controller', 'instance', false);
        this.defineAttribute('href', 'string', false);
    }


    /** @inheritDoc */
    _postConstruct (obj) {
        var displayObject = /** @type {createjs.DisplayObject} */ (super._postConstruct(obj) || obj);

        if (this.hasAttribute('href'))
            displayObject.on('click', function () {
                window.location.href = this.getAttribute('href');
            }, null, false, null, true);

        return obj;
    }
}