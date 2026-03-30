const { z } = require("zod");

const categoryIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Category ID must be a positive integer")
    .transform(Number),
});

const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(1, "Category name is required")
    .max(255, "Category name is too long"),
  slug: z.string().min(1).max(255).optional(),
  parentId: z.number().int().positive().optional().nullish(),
});

const updateCategorySchema = createCategorySchema.partial();

module.exports = {
  categoryIdParamsSchema,
  createCategorySchema,
  updateCategorySchema,
};
