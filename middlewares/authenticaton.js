const { verifyToken } = require("../utils/jwt");

function verifyUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "Invalid token" });

  const token = authHeader.split(" ")[1];
  try {
    const vToken = verifyToken(token);
    if (vToken) {
      req.user = vToken;
      return next();
    }

    return res.status(401).json({ message: "Invalid or Expired token" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or Expired token" });
  }
}

function verifyRoles(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

module.exports = { verifyUser, verifyRoles };
