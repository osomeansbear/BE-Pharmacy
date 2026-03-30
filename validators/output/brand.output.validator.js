const { z } = require("zod");

const BaseBrandSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
});

const BrandListSchema = z.array(BaseBrandSchema);

module.exports = { BaseBrandSchema, BrandListSchema };
