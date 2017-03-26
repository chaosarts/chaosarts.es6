import { Attribute } from '../Attribute';
import { defined, reflect } from '../../../core/fn';

export class Constructor extends Attribute {

    /** @override */
    _process () {
        if (!defined(this.value))
            throw new TypeError(`Class '${this.value}' is not defined.`);

        return /** @type {function ()} */ (reflect(this.value));
    }
}

Attribute.associate(Constructor, 'class');
Attribute.associate(Constructor, 'constructor');