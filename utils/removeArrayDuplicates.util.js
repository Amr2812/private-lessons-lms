/**
 * @param {Array[]} - Array should be of the form: [{ id: '', answer: '' }]
 * @returns {Array[]}
 */
module.exports = (arr = []) =>
  arr.filter(({ id }, index) => !arr.map(e => e.id).includes(id, index + 1));
