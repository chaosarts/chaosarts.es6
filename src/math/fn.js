/**
 * Crops a numeric value to given interval
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export function crop (value, min, max) {
    return Math.max(min, Math.min(value, max));
}


/**
 * Maps the value from source interval to the destination interval
 * @param {number} value
 * @param {number} srcMin
 * @param {number} srcMax
 * @param {number} dstMin
 * @param {number} dstMax
 * @return {number}
 */
export function map (value, srcMin, srcMax, dstMin, dstMax) {
    const srcLength = srcMax - srcMin;
    const dstLength = dstMax - dstMin;
    const cropVal = crop(value, srcMin, srcMax);
    const srcOffset = cropVal - srcMin;

    return srcMin + srcOffset / srcLength * dstLength;
}


/**
 * Determines if the value is included within range between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {number} type
 */
export function includes (value, min, max, rangeType = Range.CLOSED) {
    let minCmp = le;
    if (rangeType & Range.LEFT_OPEN) minCmp = lt;
    let maxCmp = ge;
    if (rangeType & Range.RIGHT_OPEN) maxCmp = gt;
    return minCmp(min, value) && maxCmp(value, max);
}


/**
 * Returns true when left value is equal to right value
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
export function eq (left, right) {
    return left == right;
}


/**
 * Returns true when left value is less than right value
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
export function lt (left, right) {
    return left < right;
}


/**
 * Returns true when left value is less than or equal right value
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
export function le (left, right) {
    return left <= right;
}


/**
 * Returns true when left value is greater than right value
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
export function gt (left, right) {
    return left > right;
}


/**
 * Returns true when left value is greater than or equal right value
 * @param {number} left
 * @param {number} right
 * @return {boolean}
 */
export function ge (left, right) {
    return left >= right;
}


/**
 * Returns the dot product of two vectors
 * @param {Vec} left
 * @param {Vec} right
 * @return {number} 
 */
export function dot(left, right) {
    return Math.sqrt(left.x * right.x + left.y * right.y);
}


/*
 +------------------------------------------------------------------------------
 | Trigonometry
 +------------------------------------------------------------------------------
 */

const RAD2DEG = Math.PI / 180;
const DEG2RAD = 180 / Math.PI;


/**
 * Converts a rad value to deg
 * @param {number} deg
 * @return {number}
 */
export function deg (rad) {
    return rad * RAD2DEG;
}


/**
 * Converts a deg value to rad
 * @param {number} rad
 * @return {number}
 */
export function rad (deg) {
    return deg * DEG2RAD;
}