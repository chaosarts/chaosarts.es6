import { Attribute } from '../Attribute';

export class Number extends Attribute {

    /** @override */
    _process () {
        let result = NaN;
        switch (this.type) {
            case 'int':
            case 'integer':
                result = parseInt(this.value);
                break;
            default:
                result = parseFloat(this.value);
                break;
        }

        if (isNaN(result))
            throw new TypeError(`Attribute [${this.name}="${this.value}"] could not be parsed to ${this.type}`);

        return result;
    }
}


Attribute.associate(Number, 'number', 'int', 'integer', 'float');