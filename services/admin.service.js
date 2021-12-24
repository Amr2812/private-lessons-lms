const { Admin } = require("../models");
const { upload } = require("./storage.service");

/**
 * @async
 * @description - Create a new assistant
 * @param  {Object} assistant
 * @returns {Promise<Object>} - The assistant object
 */
module.exports.createAssistant = async assistant =>
  await Admin.create(assistant);

/**
 * @async
 * @description Upload admin's profile image
 * @param {Object} admin - Admin object
 * @param {Object} file - File object
 * @returns {Promise<Object>} admin - Updated Admin
 */
module.exports.updateProfileImage = async (admin, file) => {
  const adminId = admin._id.toString();
  const imgLink = await upload(file, adminId, "students");

  admin.imageUrl = imgLink;
  return await Admin.findByIdAndUpdate(id, admin, { new: true })
    .select("-password")
    .lean();
};
