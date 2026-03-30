const { z } = require("zod");

const brandIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Brand ID must be a positive integer")
    .transform(Number),
});

const createBrandSchema = z.object({
  name: z
    .string({ required_error: "Brand name is required" })
    .min(1, "Brand name is required")
    .max(255, "Brand name is too long"),
  slug: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
});

const updateBrandSchema = createBrandSchema.partial();

module.exports = { brandIdParamsSchema, createBrandSchema, updateBrandSchema };
