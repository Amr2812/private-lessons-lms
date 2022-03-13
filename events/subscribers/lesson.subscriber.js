const { env } = require("../../config/constants");
const logger = require("../../config/logger");
const { templates } = require("../../config/sendGrid");
const { Student } = require("../../models");
const { notificationService } = require("../../services");
const { emitter, events } = require("../");

emitter.on(events.LESSON_PUBLISHED, async lesson => {
  try {
    await notificationService.sendToTopic(String(lesson.grade), {
      notification: {
        title: "New Lesson is Published",
        body: `${lesson.title} is now available for students to attend.`
      },
      data: {
        type: "lesson",
        id: lesson.id
      }
    });

    const students = await Student.find(
      {
        grade: lesson.grade
      },
      "email"
    ).lean();

    const emails = students.map(student => student.email);
    await sendEmail(emails, templates.NEW_LESSON_ALERT, {
      title: lesson.title,
      url: `${env.FRONTEND_URL}/lessons/${lesson.id}`
    });
  } catch (err) {
    logger.error(err);
  }
});
