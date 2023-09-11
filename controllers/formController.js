const Form = require("../Models/forms");

const addform = async (req, res) => {
  try {

    //Adding a new form in the db
    const { title, description } = req.body;
    const form = new Form({ title, description });
    const savedForm = await form.save();
    res.json(savedForm);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addform };
