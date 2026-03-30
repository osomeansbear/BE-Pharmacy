const { z } = require("zod");

const PaginationMetaSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
});

module.exports = { PaginationMetaSchema };
