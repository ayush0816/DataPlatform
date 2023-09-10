const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("please enter valid token");
  }
  const data = jwt.verify(token, "SECRET");

  req.userId = data.userId;
  next();
};

module.exports = fetchUser;
