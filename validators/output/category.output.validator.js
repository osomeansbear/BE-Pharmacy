const { z } = require("zod");

const BaseCategory = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  parentId: z.number().nullable(),
});

const BaseCategorySchema = BaseCategory.extend({});
const CategoryDetailSchema = BaseCategory.omit({ slug: true, parentId: true });

module.exports = { BaseCategorySchema, CategoryDetailSchema };
