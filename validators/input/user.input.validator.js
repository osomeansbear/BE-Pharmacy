const { z } = require("zod");

const userIdParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "User ID must be a positive integer")
    .transform(Number),
});

const createUserSchema = z.object({
  fullName: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password is too long"),

  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number is too short")
    .optional(),

  dob: z.coerce.date({ required_error: "Date of birth is required" }),

  role: z.enum(["PATIENT", "ADMIN"]),
});

const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number is too short")
      .optional(),
    role: z
      .enum(["PATIENT", "PHARMACIST", "ADMIN", "INVENTORY_MANAGER"])
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

const updateMeSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),
    phone: z
      .string()
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number is too short")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

const updateUserStatusSchema = z.object({
  isActive: z.boolean({ required_error: "isActive is required" }),
});

const updateUserRoleSchema = z.object({
  role: z.enum(["PATIENT", "ADMIN"]),
});

const loginUserSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email address format"),
  password: z
    .string({ required_error: "Password is required" })
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password is too long"),
});

module.exports = {
  createUserSchema,
  loginUserSchema,
  updateMeSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  updateUserSchema,
  userIdParamsSchema,
};
