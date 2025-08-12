// verifyJWT.js
const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).send("You must be logged in to submit the form.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // user info will be available here
    next();
  } catch (err) {
    return res.status(403).send("Invalid token.");
  }
};




module.exports = verifyJWT;
