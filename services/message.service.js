const mongoose = require("mongoose");
const { constants } = require("../config/constants");
const { Message, Student } = require("../models");
const { isStudent } = require("./student.service");
const { adminService } = require("./admin.service");
const { notificationService } = require("./notification.service");
const { formatLink } = require("../utils");
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
  if (!isStudent(role)) {
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
 * @param {Object} query
 * @param {Object} query.lessonId
 * @param {Object} [query.skip=0]
 * @param {Object} [query.limit=10]
 * @returns {Promise<Array>} { chats, total }
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
      $facet: {
        total: [
          {
            $count: "total"
          }
        ],
        chats: [
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
        ]
      }
    }
  ];

  if (lessonId) {
    aggregations.unshift({
      $match: { lessonId: mongoose.Types.ObjectId(lessonId) }
    });
  }

  let { chats, total } = await Message.aggregate(aggregations);
  chats = chats.map(chat => {
    chat.id = chat._id;
    chat.student.id = chat.student._id;
    chat.student.imageUrl = formatLink(
      constants.STUDENTS_FOLDER,
      chat.studentId
    );

    return chat;
  });

  return { chats, total };
};

/**
 * @async
 * @description Send notification to admin or student
 * @param {Object} user
 * @param {Object} message
 * @param {String} message.content
 * @param {String} message.from
 * @param {String} message.studentId
 * @param {String} message.lessonId
 * @returns {Promise<Object>} - notification
 */
module.exports.notifyAdminOrStudent = async (user, message) => {
  if (adminService.isAdmin(user)) {
    const { fcmTokens } = await Student.findOne({ _id: message.studentId })
      .select("fcmTokens")
      .lean();

    return await notificationService.sendNotification(fcmTokens, {
      notification: {
        title: "An Admin replied to your message",
        body: message.content.slice(0, 150) + "..."
      },
      data: message
    });
  } else {
    return await notificationService.sendToTopic(constants.ADMINS_FCM_TOPIC, {
      notification: {
        title: user.name,
        body: message.content.slice(0, 150) + "..."
      },
      data: message
    });
  }
};
