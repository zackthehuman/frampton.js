/**
 * Returns a boolean telling us if a given value doesn't exist or has length 0
 *
 * @name isEmpty
 * @memberOf Frampton.Utils
 * @static
 * @param {Any} obj
 * @returns {Boolean}
 */
export default function is_empty(obj) {
  return (!obj || !obj.length || 0 === obj.length);
}