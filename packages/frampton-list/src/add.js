import curry from 'frampton-utils/curry';
import contains from 'frampton-list/contains';
import append from 'frampton-list/append';
import copy from 'frampton-list/copy';

/**
 * @name addToList
 * @memberOf Frampton.List
 * @static
 * @param {Array} xs  Array to add object to
 * @param {Any}   obj Object to add to array
 * @returns {Array} A new array with the object added
 */
export default curry(function add_to_list(xs, obj) {
  return ((!contains(xs, obj)) ? append(xs, obj) : copy(xs));
});