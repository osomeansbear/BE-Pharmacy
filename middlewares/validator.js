const { ZodError } = require("zod");

function validateData(schema = {}) {
  return (req, res, next) => {
    try {
      // validate body
      if (schema.body) {
        const parsed = schema.body.parse(req.body);
        req.body = parsed;
      }

      // validate params
      if (schema.params) {
        const parsed = schema.params.parse(req.params);
        req.params = parsed;
      }

      // validate query
      if (schema.query) {
        const parsed = schema.query.parse(req.query);
        req.query = parsed;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.issues.map((issue) => ({
          path: issue.path.join(".") || "(unknown)",
          message: issue.message,
        }));

        return res.status(400).json({
          success: false,
          message: formatted,
        });
      }

      return res.status(500).json({
        success: false,
        message: [{ path: "(unknown)", message: "Internal server error" }],
      });
    }
  };
}

module.exports = validateData;
