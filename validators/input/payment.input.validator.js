const { z } = require("zod");

const paymentParamsSchema = z.object({
  orderId: z
    .string()
    .regex(/^\d+$/, "Order ID must be a positive integer")
    .transform(Number),
});

const processPaymentSchema = z.object({
  method: z.enum(["CASH", "CARD", "ONLINE", "INSURANCE"], {
    required_error: "Payment method is required",
  }),
});

module.exports = { paymentParamsSchema, processPaymentSchema };
