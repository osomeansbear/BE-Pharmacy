const { z } = require("zod");

const createUserSchema = z.object({
  name: z
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
    .min(8, "Phone number is too short")
    .optional(),

  role: z.enum(["patient", "pharmacist", "admin"]).default("patient"),
});

module.exports = { createUserSchema };
