const { bucket } = require("./firebase");
const boom = require("@hapi/boom");
const { storageService } = require("../services");

/**
 * @class
 * @description Multer Google Cloud Storage uploader
 */
class GCStorage {
  constructor(opts) {
    /**
     * @description Multer options
     */
    if (!opts.destination) {
      throw new Error("destination is required");
    }

    this.getDestination = opts.destination;
  }

  _handleFile(req, file, cb) {
    this.getDestination(req, file, (err, { name, folder }) => {
      if (err) return cb(err);

      let totalSize = 0;
      file.stream
        .on("data", chunk => {
          totalSize += chunk.length;
          if (totalSize > 5 * 1024 * 1024)
            return cb(boom.entityTooLarge("File too large (Max: 5MB)"));
        })
        .pipe(bucket.file(`${folder}/${name}`).createWriteStream())
        .on("error", err => cb(boom.boomify(err)))
        .on("finish", cb);
    });
  }

  _removeFile(req, file, cb) {
    this.getDestination(req, file, async (err, { folder, name }) => {
      if (err) return cb(err);

      const res = await storageService.deleteFile(folder, name);
      cb(null, res);
    });
  }
}

/**
 * @description Create a GCStorage instance
 * @param {Object} opts - Options
 */
module.exports.createGCStorage = (opts = {}) => new GCStorage(opts);
