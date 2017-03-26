/**
 * Defines an object path for an given object. The object will be rooted to 
 * window object.
 * @public
 * @param {string} objpath 
 * @param {*} obj
 * @param {boolean} overwrite
 * @return {boolean}
 */
export function define (objpath, obj, overwrite = true) {
    let parts = objpath.split('.');

    let parent = window;
    let child = null;
    while (parts.length > 1) {
        let part = parts.shift();
        child = parent[part] || {};
        parent = child;
    }

    if (!parent[parts[0]] || overwrite) {
        parent[parts[0]] = obj;
        return true;
    }

    return false;
}


/**
 * Determines, if given path to object is defined or not
 *
 * @public
 * @param {string} objpath Dot seperated object path
 * @param {object} rootobj The object, from which to start searching
 * @return {boolean}
 */
export function defined (objpath, rootobj = window) {
    let parts = objpath.split('.');

    if (parts.length == 0) 
        return false;

    let parent = rootobj;
    do {
        let part = parts.shift();
        if (!parent.hasOwnProperty(part))
            return false;
        parent = parent[part];
    } while (parts.length > 0);

    return true;
}


/**
 * Reflection function to get object by string
 * @public
 * @param {string} objpath
 * @param {object} rootobj
 * @return {*}
 */
export function reflect (objpath, rootobj = window) {
    let parts = objpath.split('.');

    if (parts.length == 0) 
        return false;

    let parent = rootobj;
    do {
        let part = parts.shift();
        if (!parent.hasOwnProperty(part))
            return null;
        parent = parent[part];
    } while (parts.length > 0);

    return parent;
}



export function extend (obj, def, depth = 1) {
    for (let key in def) {
        if (!obj.hasOwnProperty(key)) {
            obj[key] = def[key];
            continue;
        }

        if (isFinite(def[key]) && depth > 1) {
            extend(obj[key], def[key], depth - 1);
        }
    }

    return obj;
} 