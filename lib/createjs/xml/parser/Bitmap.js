import { Element } from '../../../xml/parser/Element';
import { DisplayObject } from './DisplayObject';


/**
 * XML parser class for container elements
 */
class Bitmap extends DisplayObject {

    /** @inheritDoc */
    constructor (element) {
        super(element);
        this.defineAttribute('src', 'image');
    }


    /** @inheritDoc */
    _construct () {
        return new createjs.Bitmap;
    }


    /** @inheritDoc */
    _postConstruct (obj) {
        var container = /** @type {createjs.Bitmap} */ (super._postConstruct(obj) || obj);
        this.children.forEach(function (childParser, index, list) {
            if (childParser instanceof DisplayObject) {
                container.addChild(childParser.result);
            }
        }, this);

        return container
    }
};

Element.associate(Bitmap, 'bitmap');