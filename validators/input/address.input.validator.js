const { z } = require("zod");

const addressIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "Address ID must be a positive integer")
    .transform(Number),
});

const createAddressSchema = z.object({
  province: z
    .string({ required_error: "Province is required" })
    .min(1, "Province is required")
    .max(100, "Province is too long"),
  district: z
    .string({ required_error: "District is required" })
    .min(1, "District is required")
    .max(100, "District is too long"),
  ward: z
    .string({ required_error: "Ward is required" })
    .min(1, "Ward is required")
    .max(100, "Ward is too long"),
  detail: z
    .string({ required_error: "Detail address is required" })
    .min(1, "Detail address is required")
    .max(255, "Detail address is too long"),
});

const updateAddressSchema = createAddressSchema
  .partial()
  .extend({ isDefault: z.boolean().optional() })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

module.exports = {
  addressIdParamsSchema,
  createAddressSchema,
  updateAddressSchema,
};
