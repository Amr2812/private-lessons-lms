const mongoose = require("mongoose");
const { Message } = require("../models");
const formatLink = require("../utils/formatLink.util");
const { constants } = require("../config/constants");

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
 * @param {String} role - student | assistant | instructor
 * @param {String} studentId
 * @param {String} lessonId
 * @returns {Promise<Array>} messages
 */
module.exports.getMessages = async (role, studentId, lessonId) => {
  if (role !== constants.ROLES_ENUM.student) {
    await Message.updateMany(
      { studentId, lessonId, seenByAdmin: false },
      { seenByAdmin: true }
    );
  }

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
      $sort: {
        seenByAdmin: 1,
        createdAt: -1
      }
    },
    {
      $group: {
        _id: "$studentId",
        messages: {
          $first: "$$ROOT"
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: "$messages"
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
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    {
      $project: {
        studentId: 1,
        lessonId: 1,
        from: 1,
        content: { $substr: ["$content", 0, 150] },
        createdAt: 1,
        seenByAdmin: 1,
        student: {
          $arrayElemAt: ["$student", 0]
        }
      }
    },
    {
      $project: {
        studentId: 1,
        lessonId: 1,
        from: 1,
        content: 1,
        createdAt: 1,
        seenByAdmin: 1,
        student: {
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
    chat.student.id = chat.student._id;
    chat.student.imageUrl = formatLink(
      constants.STUDENTS_FOLDER,
      chat.studentId
    );

    return chat;
  });
};
