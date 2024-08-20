const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // Try to get the token from the cookies first
  let token = req.cookies.token;

  // If not found, check the Authorization header
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1]; // Bearer token format
  }

  if (!token) {
    return res.status(401).json({ message: "You are not authenticated!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid!" });
    }

    req.user = { _id: data.id };
    next();
  });
};

module.exports = verifyToken; // Make sure to export it as a function
