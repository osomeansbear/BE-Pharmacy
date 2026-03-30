const { z } = require("zod");

const chatMessageSchema = z.object({
  message: z
    .string({ required_error: "Message is required" })
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .max(20)
    .optional()
    .default([]),
});

module.exports = { chatMessageSchema };
