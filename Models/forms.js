const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
