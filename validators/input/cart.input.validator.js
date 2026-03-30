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

const cartItemIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Cart item ID must be a positive integer")
    .transform(Number),
});

const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  unitType: unitTypeEnum,
  quantity: z
    .string()
    .regex(/^\d{1,10}(\.\d{1,2})?$/, "Quantity must be a positive decimal")
    .refine((v) => parseFloat(v) > 0, "Quantity must be greater than 0"),
});

const updateCartItemSchema = z.object({
  quantity: z
    .string()
    .regex(/^\d{1,10}(\.\d{1,2})?$/, "Quantity must be a positive decimal")
    .refine((v) => parseFloat(v) > 0, "Quantity must be greater than 0"),
});

module.exports = {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemIdParamsSchema,
};
