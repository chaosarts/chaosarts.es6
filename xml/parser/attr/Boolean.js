import { Attribute } from '../Attribute';

export class Boolean extends Attribute {

    /** @override */
    _process () {
        const value = this.value.toLowerCase().trim();
        switch (value) {
            case '0':
            case 'false':
                return false;
            case '1':
            case 'true':
                return true;
            default:
                throw new TypeError(`Attribute [${this.name}="${this.value}"] could not be parsed to ${this.type}`);
        }
    }
}

Attribute.associate(Boolean, 'bool', 'boolean');