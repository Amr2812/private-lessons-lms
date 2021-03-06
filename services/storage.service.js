const got = require("got");
const boom = require("@hapi/boom");
const { constants } = require("../config/constants");
const logger = require("../config/logger");
const { bucket } = require("../config/firebase");

/**
 * @async
 * @description Get a v4 signed URL for uploading file
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @param {Number} expires - Expiration duration in milliseconds
 * @returns {Promise<String>} Signed URL
 */
module.exports.getSignedUrl = async (folder, name, expires) => {
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
 * @description Streams Video
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @param {Object} { start, end } - Range
 * @returns {Promise<any>} Stream
 */
module.exports.streamVideo = (folder, name, { start, end }) =>
  bucket.file(`${folder}/${name}`).createReadStream({ start, end });

/**
 * @async
 * @description Deletes file
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @returns {Promise<any>}
 */
module.exports.deleteFile = async (folder, name) =>
  await bucket.file(`${folder}/${name}`).delete();

/**
 * @async
 * @description Download sream & upload it
 * @param {String} folder - Folder name
 * @param {String} name - File name
 * @param {String} url - URL
 * @returns {Promise<any>}
 */
module.exports.getStreamAndUpload = async (folder, name, url) => {
  try {
    return await new Promise((resolve, reject) => {
      got
        .stream(url)
        .pipe(
          bucket.file(`${folder}/${name}`).createWriteStream({
            resumable: false
          })
        )
        .on("error", reject)
        .on("finish", resolve);
    });
  } catch (err) {
    logger.error(err);
    this.deleteFile(folder, name)
      .catch(err => logger.error(err))
      .finally(() => {
        throw err;
      });
  }
};

/**
 * @description Multer Google Cloud Storage uploader
 */
class GCStorage {
  /**
   * @description Multer options
   * @param {Object} options - Multer options
   * @throws {Error} If destination is not defined
   */
  constructor(opts) {
    if (!opts.destination) {
      throw new Error("destination is required");
    }
    this.getDestination = opts.destination;

    if (opts.fileType) {
      this.fileType = opts.fileType;
    }
  }

  /**
   * @description Multer uploader
   * @param {Object} req
   * @param {Object} file
   * @param {Function} cb - Multer callback
   */
  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, { name, folder }) => {
      if (err) return cb(err);

      if (this.fileType) {
        if (!file.mimetype.includes(this.fileType)) {
          return cb(boom.badRequest(`Invalid file type ${file.mimetype}`));
        }
      }

      if (req.headers["content-length"] > constants.MAX_FILE_SIZE) {
        return cb(boom.entityTooLarge("File size too large (max: 5MB)"));
      }

      let totalSize = 0;
      file.stream
        .on("data", chunk => {
          totalSize += chunk.length;
          if (totalSize > constants.MAX_FILE_SIZE) {
            return cb(boom.entityTooLarge("File too large (Max: 5MB)"));
          }
        })
        .pipe(bucket.file(`${folder}/${name}`).createWriteStream())
        .on("error", err => cb(boom.boomify(err)))
        .on("finish", cb);
    });
  }

  /**
   * @description Multer file remover
   * @param {Object} req
   * @param {Object} file
   * @param {Function} cb - Multer callback
   */
  _removeFile(req, file, cb) {
    this.getDestination(req, file, async (err, { folder, name }) => {
      if (err) return cb(err);

      const res = await bucket.file(`${folder}/${name}`).delete();
      cb(null, res);
    });
  }
}

/**
 * @description Create a GCStorage instance
 * @param {Object} opts - Options
 */
module.exports.createGCStorage = (opts = {}) => new GCStorage(opts);
