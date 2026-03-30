const { z } = require("zod");

const unitTypeEnum = z.enum([
  "TABLET",
  "CAPSULE",
  "BLISTER",
  "STRIP",
  "BOTTLE",
  "ML",
  "GRAM",
  "BOX",
  "VIAL",
  "AMPOULE",
]);
const unitGroupEnum = z.enum(["PACKAGING", "DOSAGE", "VOLUME", "WEIGHT"]);

const decimalStringSchema = (fieldName, scale = 2) =>
  z
    .string({ required_error: `${fieldName} is required` })
    .regex(
      new RegExp(`^\\d{1,12}(\\.\\d{1,${scale}})?$`),
      `${fieldName} must be a positive decimal`,
    );

const nullableTrimmedString = (maxLength, fieldName) =>
  z.string().max(maxLength, `${fieldName} is too long`).optional().nullable();

const booleanQuerySchema = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((value) => value === true || value === "true");

const positiveIntegerQuerySchema = (fieldName, defaultValue, maxValue) =>
  z
    .union([
      z.number().int().positive(),
      z
        .string()
        .regex(/^\d+$/, `${fieldName} must be a positive integer`)
        .transform(Number),
    ])
    .refine((value) => value > 0, `${fieldName} must be a positive integer`)
    .refine(
      (value) => maxValue === undefined || value <= maxValue,
      `${fieldName} must be less than or equal to ${maxValue}`,
    )
    .default(defaultValue);

const productIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Product ID must be a positive integer")
    .transform(Number),
});

const createProductSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name is required")
    .max(255, "Product name is too long"),
  slug: z.string().min(1).max(255).optional(),
  brandId: z.number().int().positive().optional().nullable(),
  stock: z.number().int().min(0, "Stock cannot be negative").optional(),
  shortDesc: z.string().max(1000).optional().nullable(),
  requiresRx: z.boolean().optional(),
  isActive: z.boolean().optional(),
  image: z.array(z.string().url("Image must be a valid URL")).optional(),
});

const updateProductSchema = createProductSchema.partial();

const productQuerySchema = z.object({
  category: z.string().trim().min(1).max(255).optional(),
  brand: z.string().trim().min(1).max(255).optional(),
  search: z.string().trim().min(1).max(255).optional(),
  requiresRx: booleanQuerySchema.optional(),
  page: positiveIntegerQuerySchema("page", 1).optional().default(1),
  limit: positiveIntegerQuerySchema("limit", 10, 100).optional().default(10),
});

const productDetailBodySchema = z
  .object({
    description: nullableTrimmedString(10000, "description"),
    ingredients: nullableTrimmedString(10000, "ingredients"),
    usage: nullableTrimmedString(10000, "usage"),
    storageCondition: nullableTrimmedString(1000, "storageCondition"),
    warnings: nullableTrimmedString(10000, "warnings"),
    seoTitle: nullableTrimmedString(255, "seoTitle"),
    seoDescription: nullableTrimmedString(1000, "seoDescription"),
    registrationNumber: nullableTrimmedString(255, "registrationNumber"),
    manufacturer: nullableTrimmedString(255, "manufacturer"),
    origin: nullableTrimmedString(255, "origin"),
    dosageForm: nullableTrimmedString(255, "dosageForm"),
    packaging: nullableTrimmedString(255, "packaging"),
    activeIngredients: nullableTrimmedString(10000, "activeIngredients"),
    composition: z.any().optional().nullable(),
    indications: nullableTrimmedString(10000, "indications"),
    contraindications: nullableTrimmedString(10000, "contraindications"),
    sideEffects: nullableTrimmedString(10000, "sideEffects"),
    interactions: nullableTrimmedString(10000, "interactions"),
    overdose: nullableTrimmedString(10000, "overdose"),
    pharmacology: nullableTrimmedString(10000, "pharmacology"),
    pregnancyLactation: nullableTrimmedString(10000, "pregnancyLactation"),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one detail field is required",
  });

const createProductDetailSchema = productDetailBodySchema;
const updateProductDetailSchema = productDetailBodySchema;

const createProductUnitSchema = z.object({
  unitType: unitTypeEnum,
  unitGroup: z.array(unitGroupEnum).min(1, "unitGroup must not be empty"),
  price: decimalStringSchema("price", 2),
  conversionFactor: decimalStringSchema("conversionFactor", 4),
  isDefault: z.boolean().optional(),
});

const productUnitParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Product ID must be a positive integer")
    .transform(Number),
  unitId: z
    .string()
    .regex(/^\d+$/, "Unit ID must be a positive integer")
    .transform(Number),
});

const updateProductUnitSchema = z
  .object({
    price: decimalStringSchema("price", 2).optional(),
    conversionFactor: decimalStringSchema("conversionFactor", 4).optional(),
    unitGroup: z
      .array(unitGroupEnum)
      .min(1, "unitGroup must not be empty")
      .optional(),
    isDefault: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one unit field is required",
  });

const assignProductCategorySchema = z.object({
  categoryId: z.number().int().positive(),
});

const productCategoryParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Product ID must be a positive integer")
    .transform(Number),
  categoryId: z
    .string()
    .regex(/^\d+$/, "Category ID must be a positive integer")
    .transform(Number),
});

const productSlugParamsSchema = z.object({
  slug: z
    .string({ required_error: "Product slug is required" })
    .min(1, "Product slug is required"),
});

module.exports = {
  assignProductCategorySchema,
  createProductDetailSchema,
  createProductSchema,
  createProductUnitSchema,
  productQuerySchema,
  productCategoryParamsSchema,
  productIdParamsSchema,
  productSlugParamsSchema,
  productUnitParamsSchema,
  updateProductDetailSchema,
  updateProductSchema,
  updateProductUnitSchema,
};
