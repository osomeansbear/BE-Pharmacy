const jwt = require("jsonwebtoken");

function generateToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.EXPIRED_JWT || "7d",
  });
}

function verifyToken(token, secret = process.env.JWT_SECRET) {
  return jwt.verify(token, secret);
}
module.exports = { generateToken, verifyToken };
