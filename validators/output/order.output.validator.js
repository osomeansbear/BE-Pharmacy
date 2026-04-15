const { z } = require("zod");

const OrderItemOutput = z.object({
  id: z.number(),
  productId: z.number(),
  productName: z.string(),
  productImage: z.string().nullable(),
  unitType: z.string(),
  quantity: z.string(),
  baseQty: z.string(),
  unitPrice: z.string(),
});

const OrderOutput = z.object({
  id: z.number(),
  userId: z.number().nullable(),
  userEmail: z.string().nullable(),
  guestName: z.string().nullable(),
  guestPhone: z.string().nullable(),
  shippingAddress: z.object({
    province: z.string(),
    district: z.string(),
    ward: z.string(),
    detail: z.string(),
  }),
  status: z.string(),
  paymentMethod: z.string(),
  totalAmount: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  items: z.array(OrderItemOutput),
});

module.exports = { OrderOutput, OrderItemOutput };
