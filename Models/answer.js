const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  queId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  resId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Response", // Reference to the Response model
    required: true,
  },
  // Add other fields for the answer as needed
  text: String,
  // ...other fields...
});

const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
