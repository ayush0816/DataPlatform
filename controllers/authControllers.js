const UserModel = require("../Models/user");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    
    //Checking If the user is already available
    const checkUserByUserName = await UserModel.findOne({
      email: req.body.email,
    });

    if (checkUserByUserName) {
      console.log("yes");
      throw new Error("User with this username already exists");
      return false;
    }

    // Creating a new user in db
    const user = await UserModel.create(req.body); 
    const token = jwt.sign({ userId: user._id.toString() }, "SECRET");
    return res.status(200).json({ token: token, status: "success" });
  } catch (error) {
    return res.status(400).json({ error: error.message, status: "failed" });
  }
};

const login = async (req, res) => {
  try {
    // Finding an existing user
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) throw new Error("User does not exists");

    // Check if the password mathc or not
    if (user.password != req.body.password) {
      throw new Error("Invalid Password !!!");
    }

    // Send a token for the user
    const token = jwt.sign({ userId: user._id.toString() }, "SECRET");
    return res.status(200).json({ token: token, status: "success" });
  } catch (error) {
    return res.status(400).json({ error: error.message, status: "failed" });
  }
};

module.exports = { signup, login };
