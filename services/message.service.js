const boom = require("@hapi/boom");
const mongoose = require("mongoose");
const { Message } = require("../models");

/**
 * @async
 * @description Create message
 * @param {String} studentId - student id
 * @param {String} lessonId - lesson id
 * @param {String} content - message content
 * @param {String} from - student or admin
 * @returns {Promise<Object>} message
 */
module.exports.createMessage = async (studentId, lessonId, content, from) =>
  await Message.create({ studentId, lessonId, content, from });

/**
 * @description Get room name
 * @param {String} studentId
 * @param {String} lessonId
 * @returns {String} room name
 */
module.exports.getRoomName = (studentId, lessonId) =>
  `${studentId}-${lessonId}`;

/**
 * @async
 * @description Get messages
 * @param {String} studentId
 * @param {String} lessonId
 * @returns {Promise<Array>} messages
 */
module.exports.getMessages = async (studentId, lessonId) => {
  await Message.updateMany(
    { studentId, lessonId, seen: false },
    { seen: true }
  );

  return await Message.find({ studentId, lessonId })
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * @async
 * @description Get chats
 * @param {Object} query - (lessonId, skip, limit)
 * @returns {Promise<Array>} chats
 */
module.exports.getChats = async ({ lessonId, skip, limit }) => {
  const aggregations = [
    {
      $group: {
        _id: "$lessonId",
        students: { $addToSet: "$studentId" }
      }
    },
    {
      $sort: {
        seen: -1,
        createdAt: -1
      }
    },
    {
      $skip: skip || 0
    },
    {
      $limit: limit || 10
    },
    {
      $lookup: {
        from: "students",
        localField: "students",
        foreignField: "_id",
        as: "students"
      }
    },
    {
      $project: {
        students: {
          _id: 1,
          name: 1
        }
      }
    }
  ];

  if (lessonId) {
    aggregations.unshift({
      $match: { lessonId: mongoose.Types.ObjectId(lessonId) }
    });
  }

  const chats = await Message.aggregate(aggregations);

  return chats.map(chat => {
    chat.id = chat._id;
    chat.students = chat.students.map(student => {
      student.id = student._id;
      return student;
    });

    return chat;
  });
};
