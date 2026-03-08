const { z } = require("zod");

const BaseProduct = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  brandId: z.number().nullable(),
  stock: z.number(),
  requiresRx: z.boolean,
  isActive: z.boolean,
  shortDesc: null,
});

const BaseProductSchema = BaseProduct.extend({});
const ProductDetailSchema = BaseCategory.omit({ slug: true, parentId: true });
const ProductListSchema = 

module.exports = { BaseCategorySchema, CategoryDetailSchema };
