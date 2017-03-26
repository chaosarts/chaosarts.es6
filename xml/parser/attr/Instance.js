import { Attribute } from '../Attribute';
import { Constructor } from './Constructor';

export class Instance extends Constructor {

    /** @override */
    _process () {
        let ctor = /** @type {function ()} */ super._process();
        return new ctor;
    }
}

Attribute.associate(Instance, 'instance');