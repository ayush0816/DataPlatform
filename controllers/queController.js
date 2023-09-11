const Question = require("../Models/ques");

const addque = async (req, res) => {
  try {

    // Adding a new Ques to a form 
    const { formId } = req.params;
    const { text, type, options } = req.body;

    const questionData = { text, type, formId };
    if (options) {
      questionData.options = options;
    }

    const question = new Question(questionData);
    const savedQuestion = await question.save();
    res.json(savedQuestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addque };
