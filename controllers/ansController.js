const Answer = require("../Models/answer");
const Question = require("../Models/ques");
const googleSheets = require("../Services/google-sheets-api"); // Import the Google Sheets module

const addans = async (req, res) => {
  try {
    const { queId, resId } = req.params;
    const { text } = req.body;

    const question = await Question.findOne({ _id: queId });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const answer = new Answer({ queId, resId, text });
    const savedAnswer = await answer.save();

    // Prepare the data to be saved in the Google Sheet
    const rowData = [[question.text , savedAnswer.text]];
    console.log(rowData);
    // Specify your spreadsheetId and range where you want to add the data
    const spreadsheetId = "1lZ13GB6vAzMFzdA6ln6Y9YqJPLtQh6CqyqidHZfa1XU";
    const range = "Sheet1"; // Set your desired sheet and range

    // Use the Google Sheets module to add the row to the Google Sheet
    const sheetsResponse = await googleSheets.addRowToSheet(
      spreadsheetId,
      range,
      rowData
    );

    res.json({ savedAnswer, sheetsResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addans };
