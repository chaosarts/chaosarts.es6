export class Event {

    /**
     * Static constant that represents the event phase, when event is not 
     * processed at this time.
     * @public
     * @return {number}
     */
    static get NONE () {
        return window.Event.NONE;
    }

    /**
     * Static constant that represents the event phase, when the event is being 
     * propagated through the target's ancestor objects. 
     * @public
     * @return {number}
     */
    static get CAPTURING_PHASE () {
        return window.Event.CAPTURING_PHASE;
    }

    /**
     * Static constant that represents the event phase, when the event has 
     * arrived at the event's target. 
     * @public
     * @return {number}
     */
    static get AT_TARGET () {
        return window.Event.AT_TARGET;
    }

    /**
     * Static constant that represents the event phase, when the event is 
     * propagating back up through the target's ancestors in reverse order, 
     * starting with the parent, and eventually reaching the containing root.
     * @public
     * @return {number}
     */
    static get BUBBLING_PHASE () {
        return window.Event.BUBBLING_PHASE;
    }

    /**
     * The name of the event
     * @public
     * @return {string}
     */
    get type () {
        return this._type;
    }

    /**
     * The target of the event
     * @public
     * @return {EventTarget}
     */    
    get target () {
        return this._target;
    }

    /**
     * The target of the event
     * @public
     * @return {EventTarget}
     */    
    set target (target) {
        this._target = target;
    }

    /**
     * The current target of the event
     * @public
     * @return {EventTarget}
     */
    get currentTarget () {
        return this._currentTarget || this._target;
    }

    /**
     * Accessor to set the current target of this event
     * @public
     * @param {EventTarget} currentTarget
     */
    set currentTarget (currentTarget) {
        this._currentTarget = currentTarget;
    }

    /**
     * Data to pass for listeners
     * @public
     * @return {*}
     */
    get data () {
        return this._data;
    }

    /**
     * The timestamp of the event
     * @public
     * @return {?number}
     */
    get timestamp () {
        return this._timestamp;
    }

    /**
     * Indicates whether the event has been dispatched or not
     * @public
     * @return {boolean}
     */
    get dispatched () {
        return this._timestamp != null;
    }

    /**
     * The eventPhase of the event
     * @public
     * @return {number}
     */
    get eventPhase () {
        return this._eventPhase;
    }

    /**
     * The event phase
     * @public
     * @param {number}
     */
    set eventPhase (eventPhase) {
        switch (eventPhase) {
            case Event.NONE:
                throw new Error('Illegal event phase change. Event cannot be set to NONE.');
                break;
            case Event.CAPTURING_PHASE:
                if (this._eventPhase != Event.NONE || !this._bubbles) 
                    throw new Error('Illegal event phase change. Event cannot change to BUBBLING_PHASE from a pahse other than NONE and must be able to bubble.');
                break;
            case Event.AT_TARGET:
                if (this._eventPhase != Event.CAPTURING_PHASE && this._eventPhase != Event.NONE)
                    throw new Error('Illegal event phase change. Event cannot change to AT_TARGET from phase other than CAPTURING_PHASE or NONE.');
                break;
            case Event.BUBBLING_PHASE:
                if (this._eventPhase != Event.AT_TARGET || !this._bubbles)
                    throw new Error('Illegal event phase change. Event cannot change to BUBBLING_PHASE from a pahse other than AT_TARGET and must be able to bubble.'); 

        }

        this._eventPhase = eventPhase;

        if (!this.dispatched)
            this._timestamp = (new Date).getTime();
    }

    /**
     * Indicates whether the event can bubble or not
     * @public
     * @return {boolean}
     */
    get bubbles () {
        return this._bubbles;
    }

    /**
     * Indicates if the event is cancel able or not
     * @public
     * @return {boolean}
     */
    get cancelable () {
        return this._cancelable;
    }

    /**
     * Indicates whether the events propagation is stopped immediate
     * @public
     * @return {boolean}
     */
    get immediatePropagationStopped () {
        return this._immediatePropagationStopped;
    }

    /**
     * Indicates whether the events propagation is stopped 
     * @public
     * @return {boolean}
     */
    get propagationStopped () {
        return this._propagationStopped;
    }

    /**
     * Indicates whether the events default is prevented
     * @public
     * @return {boolean}
     */
    get defaultPrevented () {
        return this._defaultPrevented;
    }


    /**
     * Creates a new Event
     * @constructor
     * @public
     * @param {string} type
     * @param {boolean} cancelable
     * @param {boolean} bubbles
     * @param {*} data
     */
    constructor (type, cancelable = true, bubbles = true, data = null) {

        /**
         * The name of the event (case-insensitive).
         * @private
         * @type {string}
         */
        this._type = type.trim().toLowerCase();

        /**
         * A reference to the target to which the event was originally 
         * dispatched.
         * @private
         * @type {EventTarget}
         */
        this._target = null;

        /**
         * A reference to the currently registered target for the event. This is 
         * the object to which the event is currently slated to be sent to; it's 
         * possible this has been changed along the way through retargeting.
         * @private
         * @type {EventTarget}
         */
        this._currentTarget = null;

        /**
         * Provides the data
         * @private
         * @type {*}
         */
        this._data = data;

        /**
         * Provides the timestamp at which the Event has been dispatched
         * @private
         * @type {number}
         */
        this._timestamp = null;

        /**
         * Indicates which phase of the event flow is being processed.
         * @private
         * @type {number}
         */
        this._eventPhase = Event.NONE;

        /**
         * A Boolean indicating whether the event bubbles up through the DOM or not.
         * @private
         * @type {boolean}
         */
        this._bubbles = bubbles;

        /**
         * A Boolean indicating whether the event is cancelable.
         * @private
         * @type {boolean}
         */
        this._cancelable = cancelable;

        /**
         * Indicates whether immediate propagation has been stopped or not
         * @private
         * @type {boolean}
         */
        this._immediatePropagationStopped = false;

        /**
         * Indicates whether immediate propagation has been stopped or not
         * @private
         * @type {boolean}
         */
        this._propagationStopped = false;

        /**
         * Indicates whether default is prevented or not
         * @private 
         * @type {number}
         */
        this._defaultPrevented = false;
    }


    /**
     * Stops the propagation of events further along in the DOM.
     * @public
     */
    stopPropagation () {
        this._propagationStopped = true;
    }


    /**
     * For this particular event, no other listener will be called. Neither 
     * those attached on the same element, nor those attached on elements which 
     * will be traversed later (in capture phase, for instance)
     * @public
     */
    stopImmediatePropagation () {
        this.stopPropagation();
        this._immediatePropagationStopped = true;
    }


    /**
     * Cancels the event (if it is cancelable).
     * @public
     */
    preventDefault () {
        if (this._cancelable)
            this._defaultPrevented = true;
    }


    /**
     * Marks the event as dispatched
     * @public
     */
    markDispatched () {
        this._timestamp = (new Date).getTime();
    }
}