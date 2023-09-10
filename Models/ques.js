const mongoose = require("mongoose");

const queSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["MCQ", "Text", "Numeric", "Date"],
    required: true,
  },
  options: [{ type: String }], // For MCQ questions
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
  },
});

const Question = mongoose.model("Question", queSchema);

module.exports = Question;
