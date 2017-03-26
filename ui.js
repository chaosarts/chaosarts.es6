export { Component } from './ui/Component';

/**
 * En- or disables one or mor classes for given element
 * @public
 * @param {Element} element
 * @param {boolean} enable
 * @param {String...} classname 
 */
export function enableClass (element, enable, classname) {
    let classes = element.getAttribute('class').replace(/\s+/g, ' ').split();
    let classNamesToAdd = Array.prototype.slice.call(arguments, 2); 
    
    while (classNamesToAdd.length > 0) {
        let cls = classNamesToAdd.shift();
        if (classes.indexOf(cls) < 0)
            classes.push(cls);
    }

    element.setAttribute('class', classes.join(" "));
}