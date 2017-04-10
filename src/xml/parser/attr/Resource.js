import { Attribute } from '../Attribute';
import { Xhr } from '../../../net/Xhr';

export class Resource extends Attribute {

    _process () {
        new Xhr;
    }
}