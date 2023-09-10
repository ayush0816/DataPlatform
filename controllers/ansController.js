const Answer = require("../Models/answer");

const addans = async (req, res) => {
  try {
    const { queId, resId } = req.params;
    const { text } = req.body;

    const answer = new Answer({ queId, resId, text });
    const savedAnswer = await answer.save();
    res.json(savedAnswer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addans };
