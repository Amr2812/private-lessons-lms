const mongoose = require("mongoose");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanId = require("mongoose-lean-id");
const { nanoid } = require("nanoid");

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
    videoName: {
      type: String
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

lessonSchema.index({ grade: 1, isPublished: 1, title: "text" });

lessonSchema.pre("save", function (next) {
  if (this.isNew) {
    videoName = `${this.title.replace(/\s/g, "-")}-${nanoid()}`;
  }

  next();
});

lessonSchema.plugin(mongooseLeanVirtuals);
lessonSchema.plugin(mongooseLeanId);
lessonSchema.plugin(uniqueValidator, {
  message: "There is already a lesson with that {PATH}"
});

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
