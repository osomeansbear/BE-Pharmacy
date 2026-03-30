const { z } = require("zod");
const { AddressOutputSchema } = require("./address.output.validator.js");

const BaseUserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  fullName: z.string(),
  phone: z.string(),
  role: z.enum(["PATIENT", "PHARMACIST", "INVENTORY_MANAGER", "ADMIN"]),
  isActive: z.boolean(),
});

const UserListOutputSchema = BaseUserSchema.extend({
  createdAt: z.string(),
});

const PatientProfileSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  context: z.string(),
});

const UserDetailOutputSchema = BaseUserSchema.extend({
  createdAt: z.string(),
  updatedAt: z.string(),
  addresses: z.array(AddressOutputSchema).default([]),
  patientProfile: PatientProfileSchema.nullable().default(null),
});

const UserLoginOutputSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  fullName: z.string(),
  phone: z.string(),
  role: z.enum(["PATIENT", "PHARMACIST", "INVENTORY_MANAGER", "ADMIN"]),
  isActive: z.boolean(),
  addresses: z.array(AddressOutputSchema).default([]),
  token: z.string(),
});

module.exports = {
  BaseUserSchema,
  UserListOutputSchema,
  UserDetailOutputSchema,
  UserLoginOutputSchema,
};
