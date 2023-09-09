const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the user who submitted the response
    required: true,
  },
  answers: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answerText: String, // For text-based answers
      // Add fields for other answer types (e.g., numeric, date).
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  }, 
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
