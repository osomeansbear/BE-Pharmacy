const { verifyToken } = require("../utils/jwt");

function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Invalid token" });

  const token = authHeader.split(" ")[1];
  try {
    const vToken = verifyToken(token);
    if (vToken) {
      next();
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
}

module.exports = { verifyUser };
