const { z } = require("zod");

const PaymentOutput = z.object({
  id: z.number(),
  orderId: z.number(),
  method: z.string(),
  status: z.string(),
  amount: z.string(),
  paidAt: z.string().nullable(),
});

const PaymentOrderSummary = z.object({
  id: z.number(),
  status: z.string(),
  paymentStatus: z.string(),
});

const ProcessPaymentOutput = z.object({
  payment: PaymentOutput,
  order: PaymentOrderSummary,
});

module.exports = { PaymentOutput, PaymentOrderSummary, ProcessPaymentOutput };
