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

/**
 * @async
 * @description Gets file meta data
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @returns {Promise<Array>} File meta data
 */
module.exports.getFileMetaData = async (folder, name) =>
  await bucket.file(`${folder}/${name}`).getMetadata();

/**
 * @async
 * @description Streams Video
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @param {Object} { start, end } - Range
 * @returns {Promise<any>} Stream
 */
module.exports.streamVideo = async (folder, name, { start, end }) =>
  await bucket.file(`${folder}/${name}`).createReadStream({ start, end });
