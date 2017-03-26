import { Attribute } from '../Attribute';
import { Resolver } from '../../../core/Resolver';
import * as net from '../../../net/fn'

export class Image extends Attribute {

    /** @override */
    _process () {
        const resolver = new Resolver;
        
        let img = new Image;
        img.onerror = error => resolver.reject(error);
        img.onload = () => resolver.resolve(img);
        img.src = net.url(this.value, this.baseURI);

        return resolver.promise;
    }
}

Attribute.associate(Image, 'img');