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