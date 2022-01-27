const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");
const formatLink = require("../utils/formatLink.util");

const lessonSchema = mongoose.Schema(
  {
    grade: {
      type: mongoose.Types.ObjectId,
      ref: "Grade"
    },
    title: {
      type: String,
      unique: true
    },
    notes: {
      type: String
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true } }
);

lessonSchema.virtual("videoUrl").get(function () {
  return formatLink("lessons", this._id);
});

lessonSchema.index({ grade: 1, isPublished: 1, title: "text" });

lessonSchema.plugin(mongooseLeanVirtuals);

lessonSchema.plugin(mongooseLeanId);

lessonSchema.plugin(uniqueValidator, {
  message: "There is already a lesson with that {PATH}"
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
