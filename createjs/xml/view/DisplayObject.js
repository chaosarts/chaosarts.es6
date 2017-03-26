let displayObjectClasses = new Array();
let viewClasses = new Array();

export class DisplayObject {

    static associate (DisplayObjectClass, ViewClass) {

        if (!(DisplayObjectClass.prototype instanceof createjs.DisplayObject)) {
            console.warn(`Class to associate for xml view class must be a subclass of createjs.DisplayObject`);
            return;
        }

        if (!(ViewClass.prototype instanceof DisplayObject)) {
            console.warn(`Class to associate with display object class must be a subclass of createjs.xml.view.DisplayObject`);
            return;
        }

        let index = displayObjectClasses.indexOf(DisplayObjectClass);
        if (index) {
            console.warn(`DisplayObject class already associated with a view class. Association will be overwritten.`, DisplayObjectClass);
            viewClasses[index] = ViewClass;
        }
        else {
            displayObjectClasses.push(DisplayObjectClass);
            viewClasses.push(ViewClass);
        }
    }


    static get (displayObject) {
        const index = displayObjectClasses.indexOf(displayObject.constructor);
        if (!index) {
            console.warn('No association found.');
            return null;
        }

        return viewClasses[index];
    }

    /**
     * Accessor for tag name
     */
    get tagName () {
        throw new Error('Subclass of DisplayObject xml representation must implement tagName getter.');
    }


    /**
     * Creates a new createjs xml view 
     * @param {createjs.DisplayObject} displayObject
     */
    constructor (displayObject) {

        /**
         * Provides the display object to represent
         */
        this._displayObject = displayObject;
    }
}