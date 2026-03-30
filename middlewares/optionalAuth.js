const { verifyToken } = require("../utils/jwt");

/**
 * Optional authentication middleware.
 * If a valid Bearer token is present, sets req.user.
 * If not, continues without setting req.user (guest access).
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  } catch {
    // Invalid token — treat as guest
  }

  return next();
}

module.exports = { optionalAuth };
