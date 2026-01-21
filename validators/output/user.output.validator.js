const { z } = require("zod");

// --- SUB-SCHEMAS (Dựa trên quan hệ) ---

const AddressSchema = z.object({
  id: z.number(),
  full_name: z.string().nullable(),
  phone: z.string().nullable(),
  address_line: z.string().nullable(),
  city: z.string().nullable(),
  province: z.string().nullable(),
  postal_code: z.string().nullable(),
  is_default: z.boolean().nullable(), // DB là Boolean? nên để nullable
});

const HealthProfileSchema = z.object({
  allergies: z.string().nullable(),
  chronic_conditions: z.string().nullable(),
  current_medications: z.string().nullable(),
  updated_at: z.string().nullable(),
});

// --- USER SCHEMAS ---

// 1. Base Schema: Các trường cơ bản trong bảng users
const BaseUserSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  // Role là enum, nhưng output ra string vẫn hợp lệ
  role: z.enum(["patient", "pharmacist", "admin"]).nullable(),
  loyalty_points: z.number().int().nullable().default(0), // Int?
  is_active: z.boolean().nullable().default(true), // Boolean?
});

// 2. List Output Schema: Dùng cho danh sách
const UserListOutputSchema = BaseUserSchema.extend({
  created_at: z.string(), // DateTime convert sang String ISO
});

// 3. Detail Output Schema: Dùng cho chi tiết
// ĐÃ XÓA STATS, chỉ giữ lại thông tin User và Relation
const UserDetailOutputSchema = BaseUserSchema.extend({
  created_at: z.string(),
  updated_at: z.string().nullable(),

  // Relations (Vẫn giữ vì bạn có include trong repo)
  addresses: z.array(AddressSchema).optional().default([]),

  // Health Profile (Quan hệ 1-1, có thể null)
  user_health_profiles: HealthProfileSchema.nullable().optional(),
});

const UserLoginOutputSchema = z.object({
  id: z.number().int(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  role: z.enum(["patient", "pharmacist", "admin"]).nullable(),
  is_active: z.boolean().nullable().default(true),

  // Relations
  addresses: z.array(AddressSchema).default([]),

  // Token nằm chung cấp với user info
  token: z.string(),
});

module.exports = {
  BaseUserSchema,
  UserListOutputSchema,
  UserDetailOutputSchema,
  UserLoginOutputSchema,
};
