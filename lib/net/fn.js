import { extend } from '../core/fn';
import { Resolver } from '../core/Resolver';

/**
 * Returns a url string relative to given base uri
 * @return {string}
 */
export function url (urlString, baseURI = window.location.href) {
    if (/^(https?:\/\/|\/)/.test(path)) 
        return path;

    return baseURI.replace(/(\/[^\/]*)?$/, '/') + path;
}