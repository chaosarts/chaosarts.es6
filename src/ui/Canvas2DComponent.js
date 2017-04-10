import { Component } from './Component';


export class Canvas2DComponent extends Component {

    /**
     * Accessor to get the webgl context
     * @public
     * @return {?CanvasRenderingContext2D}
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
         * @type {?CanvasRenderingContext2D}
         */
        this._context = null;
    }


    /**
     * Prepares the 2d context
     * @protected
     */
    _prepareCanvas2D () {

    }


    /** @inheritDoc */
    _willUnsetElement () {
        this._context = null;
    }


    /** @inheritDoc */
    _didSetElement () {
        let element = this.element;

        if (!(element instanceof HTMLCanvasElement))
            throw new Error('Canvas2DComponent expects an HTMLCanvasElement.');

        let context = element.getContext('2d');
        if (!(context instanceof WebGLRenderingContext))
            throw new Error(`Canvas rendering context already retrieved for ${context.constructor.name}`);

        this._context = context;
    }
}

Component.associate(Canvas2DComponent, 'canvas2d');