const { bucket } = require("../config/firebase");

/**
 * @async
 * @description uploads a file to firebase storage
 * @param  {String} file
 * @param  {String} name
 * @param  {String} folder
 * @returns {Promise<String>} File Link
 */
module.exports.upload = async (file, name, folder) => {
  const res = await bucket.upload(file.path, {
    destination: `${folder}/${name}`
  });

  return res[0].metadata.mediaLink;
};
