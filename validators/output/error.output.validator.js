const { z } = require("zod");

const ErrorItemSchema = z.object({
  path: z.string(),
  message: z.string(),
});

const ErrorOutputSchema = z.object({
  success: z.boolean(),
  message: z.array(ErrorItemSchema),
});

module.exports = { ErrorOutputSchema };
