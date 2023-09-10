const Response = require("../Models/response");
const Answer = require("../Models/answer");
const Question = require("../Models/ques");
const googleSheets = require("../Services/google-sheets-api"); // Import the Google Sheets module

const addres = async (req, res) => {
  try {
    const { formId } = req.params;
    const { userId } = req; // Assuming userId is available in the request due to middleware
    const { answers } = req.body;

    const response = new Response({ formId, userId });
    const savedResponse = await response.save();
    const rowData = [];

    for (const answerData of answers) {
      const { queId, text } = answerData;

      const question = await Question.findOne({ _id: queId });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const answer = new Answer({
        resId: response._id, // Link the answer to the response using its ID
        queId,
        text,
      });

      await answer.save();
      rowData.push([question.text, answer.text]);
    }

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

    res.json({ savedResponse, sheetsResponse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addres };
