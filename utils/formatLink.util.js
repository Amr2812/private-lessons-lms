const { env } = require("../config/constants");

/**
 * 
 * @param {String} folder 
 * @param {String} name 
 * @returns {String} File URL
 */
module.exports = (folder, name) => {
  return `https://storage.googleapis.com/download/storage/v1/b/${env.GCS_BUCKET}/o/${folder}%2F${name}?alt=media`;
}