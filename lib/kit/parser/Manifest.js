import { Element } from '../../xml/parser/Element';
import { defined, reflect } from '../../core/fn';
import { AppComponent } from '../../ui/AppComponent';
import { Component } from '../../ui/Component';

/**
 * Element parser handling manifest tags
 */
export class Manifest extends Element {

    /** @inheritDoc */
    constructor (element, baseURI = null) {
        super(element, baseURI);
        this.defineAttribute('name', 'string', false);
    }
    

    /** @inheritDoc */
    _construct () {
        const name = this.getAttribute('name', 'application');
        const element = document.getElementById(name);
        element.setAttribute(Component.ATTRIBUTE_NAME, name);
        const delegate = Component.getComponentByElement(element);

        if (null == delegate)
            throw new Error(`Element with id '${name}' for AppComponent not found.`);

        if (!(delegate instanceof AppComponent))
            throw new Error('Component for application must be an instance of AppComponent');

        return delegate;
    }    
}

Element.associate(Manifest, 'manifest');