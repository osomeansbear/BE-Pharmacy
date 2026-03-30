const { z } = require("zod");

const AddressOutputSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  province: z.string(),
  district: z.string(),
  ward: z.string(),
  detail: z.string(),
  isDefault: z.boolean(),
});

module.exports = { AddressOutputSchema };
