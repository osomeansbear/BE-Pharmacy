const { z } = require("zod");
const { BaseBrandSchema } = require("./brand.output.validator.js");

const UnitTypeSchema = z.enum(["TABLET", "BOX"]);

const ProductUnitSchema = z.object({
  id: z.number().int(),
  unitType: UnitTypeSchema,
  price: z.string(),
  conversionFactor: z.string(),
  isDefault: z.boolean(),
});

const BaseProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  brandId: z.number().int().nullable(),
  brandName: z.string().nullable().optional(),
  stock: z.number().int(),
  requiresRx: z.boolean(),
  isActive: z.boolean(),
  shortDesc: z.string().nullable(),
  image: z.array(z.string()).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
  units: z.array(ProductUnitSchema).default([]),
  categoryIds: z.array(z.number().int()).default([]),
});

const ProductListSchema = z.array(BaseProductSchema);

const ProductDetailSchema = BaseProductSchema.extend({
  productId: z.number().int(),
  description: z.string().nullable(),
  ingredients: z.string().nullable(),
  usage: z.string().nullable(),
  storageCondition: z.string().nullable(),
  warnings: z.string().nullable(),
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  registrationNumber: z.string().nullable(),
  manufacturer: z.string().nullable(),
  origin: z.string().nullable(),
  dosageForm: z.string().nullable(),
  packaging: z.string().nullable(),
  activeIngredients: z.string().nullable(),
  composition: z.any().nullable(),
  indications: z.string().nullable(),
  contraindications: z.string().nullable(),
  sideEffects: z.string().nullable(),
  interactions: z.string().nullable(),
  overdose: z.string().nullable(),
  pharmacology: z.string().nullable(),
  pregnancyLactation: z.string().nullable(),
  brand: BaseBrandSchema.nullable(),
});

module.exports = {
  BaseProductSchema,
  ProductListSchema,
  ProductDetailSchema,
  ProductUnitSchema,
};
