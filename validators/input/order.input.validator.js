const { z } = require("zod");

const orderItemSchema = z.object({
  productId: z
    .number({ required_error: "Product ID is required" })
    .int("Product ID must be an integer")
    .positive("Product ID must be positive"),
  unitType: z.enum(["TABLET", "BOX"], { required_error: "Unit type is required" }),
  quantity: z
    .string({ required_error: "Quantity is required" })
    .regex(
      /^\d{1,10}(\.\d{1,2})?$/,
      "Quantity must be a positive decimal (max 2 decimal places)",
    )
    .refine((v) => parseFloat(v) > 0, "Quantity must be greater than 0"),
});

const createOrderSchema = z.object({
  addressId: z
    .number({ required_error: "Address ID is required" })
    .int("Address ID must be an integer")
    .positive("Address ID must be positive"),
  paymentMethod: z.enum(["CASH", "CARD", "ONLINE"], {
    required_error: "Payment method is required",
  }),
  items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
});

const guestInfoSchema = z.object({
  name: z.string().min(1, "Guest name is required"),
  phone: z.string().min(1, "Guest phone is required"),
});

const adminCreateOrderSchema = z
  .object({
    userId: z.number().int().positive().optional(),
    guestInfo: guestInfoSchema.optional(),
    shippingAddress: z.object({
      province: z.string().min(1, "Province is required"),
      district: z.string().min(1, "District is required"),
      ward: z.string().min(1, "Ward is required"),
      detail: z.string().min(1, "Detail address is required"),
    }),
    paymentMethod: z.enum(["CASH", "CARD", "ONLINE"], {
      required_error: "Payment method is required",
    }),
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
  })
  .refine((data) => data.userId !== undefined || data.guestInfo !== undefined, {
    message: "Either userId or guestInfo must be provided",
  });

const orderIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Order ID must be a positive integer")
    .transform(Number),
});

module.exports = {
  createOrderSchema,
  adminCreateOrderSchema,
  orderItemSchema,
  orderIdParamsSchema,
};
