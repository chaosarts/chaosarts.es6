let key2class = new Map();
let key2instance = new Map();

class Helper {

    /**
     * Associates a helper class with given helper names
     * @public
     * @param {function ()}
     * @param {...string}
     */
    static associate (ctor, helperName) {
        let args = Array.prototype.slice.call(arguments, 1);

        if (args == 0) {
            console.warn('No name given to associate helper class');
            return;
        }

        if (!(ctor.prototype instanceof Helper)) {
            console.warn(`Class to associate with helper names '${args.join('\', \'')}> must be a subclass of Helper.`);
            return;
        }

        do {
            const name = args.shift();
            const key = name.toLowerCase();

            if (key2class.has(key))
                console.warn(`A helper class has already been associated with helper name <${name}>. Will be overwritten.`);

            key2class.set(key, ctor);
        } while(args.length > 0)
    }


    /**
     * Returns the helper associated with given name. Each helper class will be
     * instatiated only once.
     * @public
     * @param {string} name
     * @return {?Helper}
     */
    static getHelperByName (name) {
        const key = name.toLowerCase();
        if (!key2class.has(key)) {
            console.warn(`No helper found for name ${name}`);
            return null;
        }

        if (!key2instance.has(key)) {
            const ctor = key2class.get(key);
            key2instance.get(new ctor());
        }

        return key2instance.get(name);
    }


    /**
     * Setup the component
     * @public
     * @param {Component} component
     * @param {string} helperName
     */
    setup (component, helperName) {
        throw new Error('Subclass of Helper for Component must implement setup()');
    }


    /**
     * Reverts the setup
     * @public
     * @param {Component} component
     * @param {string} helperName
     */
    cease (component, helperName) {
        throw new Error('Subclass of Helper for Component must implement cease()');
    }
}