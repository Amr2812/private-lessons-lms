const { Lesson } = require("../models");
const { upload } = require("./storage.service");

/**
 * @async
 * @description create a new lesson
 * @param {Oject} lesson
 * @returns {Promise<Object>}
 */
module.exports.createLesson = async lesson => await Lesson.create(lesson);

/**
 * @async
 * @description update video
 * @param {String} id - Lesson id
 * @param {Object} file - File object
 * @returns {Promise<Object>}
 */
module.exports.updateVideo = async (id, file) => {
  const videoLink = await upload(file, id, "lessons");

  return await Lesson.findByIdAndUpdate(
    id,
    { videoLink },
    { new: true }
  ).lean();
};
