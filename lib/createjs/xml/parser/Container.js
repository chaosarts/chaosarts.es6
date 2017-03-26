import { DisplayObject } from './DisplayObject';


/**
 * XML parser class for container elements
 */
class Container extends DisplayObject {

    /** @inheritDoc */
    _construct () {
        return new createjs.Container;
    }


    /** @inheritDoc */
    _postConstruct (obj) {
        var container = /** @type {createjs.Container} */ (super._postConstruct(obj) || obj);
        this.children.forEach(function (childParser, index, list) {
            if (childParser instanceof DisplayObject) {
                container.addChild(childParser.result);
            }
        }, this);

        return container
    }
};

Element.associate(Container, 'container');