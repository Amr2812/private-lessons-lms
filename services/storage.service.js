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
 * @description Get a v4 signed URL for uploading file
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @param {Number} expires - Expiration duration in milliseconds
 * @returns {Promise<String>} Signed URL
 */
module.exports.getSignedUrl = async (
  folder,
  name,
  expires
) => {
  const [url] = await bucket.file(`${folder}/${name}`).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + (expires || 15 * 60 * 1000) /* 15 minutes */,
    contentType: "application/octet-stream"
  });

  return url;
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
