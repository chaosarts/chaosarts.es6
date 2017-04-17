/**
 * Determines if given element has given class
 * @param {Element} element
 * @param {string} classname
 * @return {boolean}
 */
export function hasClass (element, classname) {
    let classes = element.getAttribute('class').split(' ');
    return classes.indexOf(classname) > -1;
}

/**
 * En- or disables one or mor classes for given element
 * @public
 * @param {Element} element
 * @param {boolean} enable
 * @param {String...} classname 
 */
export function enableClass (element, enable, classname) {
    let elementClasses = element.getAttribute('class').replace(/\s+/g, ' ').split(' ');
    let inClasses = Array.prototype.slice.call(arguments, 2); 
    let outClasses = new Array();
    
    if (enable) {
        outClasses = elementClasses;

        while (inClasses.length > 0) {
            let inClass = inClasses.shift();
            if (elementClasses.indexOf(inClass) < 0)
                elementClasses.push(inClass);
        }

    }
    else {
        while (elementClasses.length > 0) {
            const elementClass = elementClasses.shift();
            if (inClasses.indexOf(elementClass) < 0)
                outClasses.push(elementClass);
        }   
    }

    element.setAttribute('class', outClasses.join(" "));
}