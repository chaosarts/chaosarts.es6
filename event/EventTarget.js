import { Event } from './Event';
import { Resolver } from '../core/Resolver'

export class EventTarget {

    /**
     * Determines, whether the this target is the root or not
     * @public
     * @return {boolean}
     */
    get isRootTarget () {
        return this._parentTarget == null;
    }

    /**
     * Accessor to get the parent target of this target
     * @public
     * @return {EventTarget}
     */
    get parentTarget () {
        return this._parentTarget;
    }

    /**
     * Accessor to set the parent target of this target
     * @public
     * @return {EventTarget}
     */
    set parentTarget (parentTarget) {
        this._parentTarget = parentTarget;
    }


    /**
     * Creates a new event target object
     */
    constructor () {

        /**
         * @private
         * @type {Map<string, Array<EventListener>}
         */
        this._listeners = new Map;

        /**
         * Provides the parent target of this target
         * @private
         * @type {EventTarget}
         */
        this._parentTarget = null;
    }


    /**
     * Adds a new event listener to the target
     * @public
     * @param {string} type The type string of the event
     * @param {func(Event)} listener The callback function
     * @param {(boolean|object)=} optionsOrCaptureFlag The capture flag or an object of options
     * @param {object=} scope The scope of the callback
     */
    addEventListener (type, listener, optionsOrCaptureFlag = null, scope = null) {
        let listeners = this._listeners.get(type) || new Array;
        let options = this._buildOptions(optionsOrCaptureFlag);

        if (!this.hasEventListener(type, listener, optionsOrCaptureFlag, scope))
            listeners.push(new EventListener(listener, options['useCapture'], options['once'], options['passive'], scope));

        this._listeners.set(type, listeners);
    }


    /**
     * Determines whether the target has given listener for type or not
     * @public
     * @param {string} type The type string of the event
     * @param {func(Event)} listener The callback function
     * @param {(boolean|object)=} optionsOrCaptureFlag The capture flag or an object of options
     * @param {object=} scope The scope of the callback
     * @return {boolean}
     */
    hasEventListener (type, listener, optionsOrCaptureFlag = null, scope = null) {
        if (!this._listeners.has(type)) 
            return false;

        let options = this._buildOptions(optionsOrCaptureFlag);
        let eventListeners = this._listeners.get(type).slice(0);
        while (eventListeners.length > 0) {
            let eventListener = eventListeners.shift();
            if (this._isEqual(eventListener, listener, options, scope))
                return true;
        }

        return false;
    }


    /**
     * Removes the event listeners specified by the parameters
     * @public
     * @param {string} type The type string of the event
     * @param {func(Event)} listener The callback function
     * @param {(boolean|object)=} optionsOrCaptureFlag The capture flag or an object of options
     * @param {object=} scope The scope of the callback
     */
    removeEventListener (type, listener, optionsOrCaptureFlag = null, scope = null) {
        if (!this._listeners.has(type)) 
            return false;

        let options = this._buildOptions(optionsOrCaptureFlag);
        let eventListeners = this._eventListeners.get(type);
        eventListeners = eventListeners.filter((eventListener, index, list) => {
            return !this._isEqual(eventListener, listener, options, scope);
        });

        this._listeners.set(type, eventListeners);
    }


    /**
     * Dispatches the event
     * @public
     * @param {Event} event
     * @return {Promise}
     */
    dispatchEvent (event) {
        let resolver = new Resolver;
        setTimeout(() => {
            if (event.dispatched) 
                throw new Error('Invalid event. Event has already been dispatched by another target.');

            event.markDispatched();
            event.target = this;

            if (event.bubbles && !this.isRoot) {
                let targets = this._getRootLine();

                /// Capture phase
                event.eventPhase = Event.CAPTURING_PHASE;
                for (let i = 0, max = targets.length; i < max; i++) {
                    targets[i]._notifyListeners(event);
                    if (event.propagationStopped) {
                        resolver.resolve(false);
                        return;
                    } 
                }

                /// At target phase
                event.eventPhase = Event.AT_TARGET;
                this._notifyListeners(event);

                if (event.propagationStopped) {
                    resolver.resolve(false);
                    return;
                } 


                /// Bubble phase
                event.eventPhase = Event.BUBBLING_PHASE;
                for (let i = targets.length - 1; i >= 0; i--) {
                    targets[i]._notifyListeners(event);
                    if (event.propagationStopped) {
                        resolver.resolve(false);
                        return;
                    } 
                }

                return resolver.resolve(false);
            }
            else {
                /// At target phase
                event.eventPhase = Event.AT_TARGET;
                this._notifyListeners(event);
            }
        }, 0);


        return resolver.promise;
    }


    /**
     * Returns the list of targets from root to parent target of this target
     * @private
     * @return {Array<EventTarget>}
     */
    _getRootLine () {
        let array = new Array;
        let current = this.parentTarget;

        while (current != null) {
            array.push(current);
            current = current.parentTarget;
        }

        return array;
    }


    _notifyListeners (event) {
        if (!this._listeners.has(event.type))
            return true;

        let eventListeners = this._listeners.get(event.type);
        const max = eventListeners.length;
        let i = 0;
        while (i++ < max) {
            let eventListener = eventListeners.shift();
            eventListener.callback.call(eventListener.scope, event);
            if (!eventListener.once) eventListeners.push(eventListener);
            if (event.immediatePropagationStopped)
                return false;
        }

        return true;
    }


    _isEqual (eventListener, listener, options, scope) {
        return eventListener.callback == listener && 
            eventListener.useCapture == options['useCapture'] &&
            eventListener.once == options['once'] &&
            eventListener.passive == options['passive'] &&
            scope == scope;
    }


    _buildOptions (optionsOrCaptureFlag) {
        let capture = false, once = false, passive = false;
        if (isFinite(optionsOrCaptureFlag)) {
            capture = !!optionsOrCaptureFlag;
        }
        else {
            capture = optionsOrCaptureFlag['capture'] || false;
            once = optionsOrCaptureFlag['once'] || false;
            passive = optionsOrCaptureFlag['passive'] || false;
        }

        return {
            'capture': capture,
            'once': once,
            'passive': passive,
        }
    }
}


class EventListener {


    get callback () {
        return this._callback;
    }


    get useCapture () {
        return this._useCapture
    }


    get once () {
        return this._once;
    }


    get passive () {
        return this._passive;
    }


    get scope () {
        return this._scope;
    }


    constructor (callback, useCapture = false, once = false, passive = false, scope = null) {

        /**
         * Provides the callback of the listener
         * @private
         * @type {func(CustomEvent)}
         */
        this._callback = callback;

        /**
         * Indicates whether the listener uses capture
         * @private
         * @type {boolean}
         */
        this._useCapture = useCapture;

        /**
         * Indicates whether the listener listen once
         * @private
         * @type {boolean}
         */
        this._once = once;

        /**
         * Indicates whether the listener listens passive
         * @private
         * @type {boolean}
         */
        this._passive = passive;

        /**
         * Provides the scope of the listener
         * @private
         * @type {object}
         */
        this._scope = scope;
    }
}