import { Component } from './Component';


export class WebGLComponent extends Component {

    /**
     * Accessor to get the webgl context
     * @public
     * @return {?WebGLRenderingContext}
     */
    get context () {
        return this._context;
    }

    /** @inheritDoc */
    constructor () {
        super();

        /**
         * Provides the webgl context of the element
         * @private
         * @type {?WebGLRenderingContext}
         */
        this._context = null;

        /**
         * Handler for event, when context creation fails
         * @private
         * @type {function (Event)}
         */
        this._onWebGLContextCreationError = onWebGLContextCreationError.bind(this);

        /**
         * Handler for event, when context got lost
         * @private
         * @type {function (Event)}
         */
        this._onWebGLContextLost = onWebGLContextLost.bind(this);

        /**
         * Handler for event, when context is restored
         * @private
         * @type {function (Event)}
         */
        this._onWebGLContextRestored = onWebGLContextRestored.bind(this);
    }


    /**
     * Prepares the webgl
     * @protected
     */
    _prepareWebGL () {

    }


    /** @inheritDoc */
    _willUnsetElement () {
        let element = this.element;
        element.removeEventListener('webglcontextcreationerror', this._onWebGLContextCreationError, false);
        element.removeEventListener('webglcontextlost', this._onWebGLContextLost, false);
        element.removeEventListener('webglcontextrestored', this._onWebGLContextRestored, false);
        this._context = null;
    }


    /** @inheritDoc */
    _didSetElement () {
        let element = this.element;

        if (!(element instanceof HTMLCanvasElement))
            throw new Error('WebGLComponent expects an HTMLCanvasElement.');

        element.addEventListener('webglcontextcreationerror', this._onWebGLContextCreationError, false);
        element.addEventListener('webglcontextlost', this._onWebGLContextLost, false);
        element.addEventListener('webglcontextrestored', this._onWebGLContextRestored, false);


        let context = element.getContext('webgl');
        if (!(context instanceof WebGLRenderingContext))
            throw new Error(`Canvas rendering context already retrieved for ${context.constructor.name}`);

        this._context = context;
        this._prepareWebGL();
    }
}


/**
 * Trait listener function
 * @param {Event} event
 */
function onWebGLContextCreationError (event) {
    
}


/**
 * Trait listener function
 * @param {Event} event
 */
function onWebGLContextLost (event) {

}


/**
 * Trait listener function
 * @param {Event} event
 */
function onWebGLContextRestored (event) {

}

Component.associate(OpenGLComponent, 'opengl');