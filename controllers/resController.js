const Response = require("../Models/response");

const addres = async(req,res) =>{
    try {
        const { formId } = req.params;
        const { userId } = req; // Assuming userId is available in the request due to middleware
    
        const response = new Response({ formId, userId });
        const savedResponse = await response.save();
        res.json(savedResponse);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

module.exports = { addres };