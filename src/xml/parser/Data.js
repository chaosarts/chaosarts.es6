import { Element } from './Element';

/**
 * @constructor
 * @extends {Element}
 */
class Data extends Element {

    /** @inheritDoc */
    constructor (element) {
        super(element);

        var type = '';
        var tagname = element.tagName.toLowerCase();

        if (tagname != 'data') type = tagname;
        else type = element.getAttribute('type') || 'string';

        this.defineAttribute('name', 'string');
        this.defineAttribute('type', 'string');
        this.defineAttribute('value', type);
    }


    /** @inheritDoc */
    _construct () {
        return this.getAttribute('type');
    }
}


Element.associate(Data, 'data', 'bool', 'boolean', 'number', 'int', 'integer', 'float');