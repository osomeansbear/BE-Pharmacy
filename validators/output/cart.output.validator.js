const { z } = require("zod");

const CartItemOutputSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  productId: z.number().int(),
  productName: z.string(),
  productImage: z.string().nullable(),
  unitType: z.string(),
  quantity: z.string(),
  unitPrice: z.string(),
  conversionFactor: z.string(),
  lineTotal: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CartOutputSchema = z.object({
  items: z.array(CartItemOutputSchema),
  totalAmount: z.string(),
});

module.exports = { CartItemOutputSchema, CartOutputSchema };
