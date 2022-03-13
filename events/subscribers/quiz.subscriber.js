const { env } = require("../../config/constants");
const logger = require("../../config/logger");
const { templates } = require("../../config/sendGrid");
const { Student } = require("../../models");
const { notificationService, mailService } = require("../../services");
const { emitter, events } = require("../");

emitter.on(events.QUIZ_PUBLISHED, async quiz => {
  try {
    await notificationService.sendToTopic(String(quiz.grade), {
      notification: {
        title: "New Quiz is Published",
        body: `${quiz.title} is now available for students to take.`
      },
      data: {
        type: "quiz",
        id: quiz.id
      }
    });

    const students = await Student.find(
      {
        grade: quiz.grade
      },
      "email"
    ).lean();

    const emails = students.map(student => student.email);
    await mailService.sendEmail(emails, templates.NEW_QUIZ_ALERT, {
      title: quiz.title,
      url: `${env.FRONTEND_URL}/quizzes/${quiz.id}`
    });
  } catch (err) {
    logger.error(err);
  }
});
