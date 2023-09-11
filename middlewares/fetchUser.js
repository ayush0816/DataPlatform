const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  // Fetch the token from header
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("please enter valid token");
  }

  // Verify the token with secret
  const data = jwt.verify(token, "SECRET");

  //Adding userId in request
  req.userId = data.userId;
  next();
};

module.exports = fetchUser;
