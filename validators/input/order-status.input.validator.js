const { z } = require("zod");

const orderStatusParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Order ID must be a positive integer")
    .transform(Number),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "FULFILLED",
    "CANCELLED",
    "RETURNED",
  ]),
});

module.exports = { orderStatusParamsSchema, updateOrderStatusSchema };
