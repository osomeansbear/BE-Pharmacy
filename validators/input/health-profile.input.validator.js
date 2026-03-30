const { z } = require("zod");

const healthProfileSchema = z.object({
  allergies: z.string().max(500).optional().default(""),
  chronicDiseases: z.string().max(500).optional().default(""),
  context: z.string().max(2000).optional().default(""),
});

module.exports = { healthProfileSchema };
