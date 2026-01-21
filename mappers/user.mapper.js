const {
  UserListOutputSchema,
  UserDetailOutputSchema,
  UserLoginOutputSchema,
} = require("../validators/output/user.output.validator");

class UserMapper {
  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  static #mapAddress(addr) {
    if (!addr) return null;
    return {
      id: addr.id,
      full_name: addr.full_name ?? null,
      phone: addr.phone ?? null,
      address_line: addr.address_line ?? null,
      city: addr.city ?? null,
      province: addr.province ?? null,
      postal_code: addr.postal_code ?? null,
      is_default: addr.is_default ?? false,
    };
  }

  static #mapHealthProfile(profile) {
    if (!profile) return null;
    return {
      allergies: profile.allergies ?? null,
      chronic_conditions: profile.chronic_conditions ?? null,
      current_medications: profile.current_medications ?? null,
      updated_at: profile.updated_at?.toISOString() ?? null,
    };
  }

  // =========================================================================
  // PUBLIC MAPPERS
  // =========================================================================

  static mapToLogin(model, token) {
    return UserLoginOutputSchema.parse({
      // 1. Map các field user cơ bản
      id: model.id,
      name: model.name,
      phone: model.phone,
      role: model.role,
      is_active: model.is_active ?? true,

      // 2. Map Addresses
      addresses: (model.addresses || []).map((addr) => this.#mapAddress(addr)),

      // 3. Inject Token vào output
      token: token,
    });
  }
  /**
   * Map cho màn hình Danh sách
   */
  static mapToListItem(model) {
    return UserListOutputSchema.parse({
      id: model.id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      role: model.role,
      loyalty_points: model.loyalty_points ?? 0,
      is_active: model.is_active ?? true,
      created_at: model.created_at.toISOString(),
    });
  }

  static mapToList(models) {
    return models.map((m) => this.mapToListItem(m));
  }

  /**
   * Map cho màn hình Chi tiết
   * Chỉ map đúng các trường có trong DB users và relations đi kèm
   */
  static mapToDetail(model) {
    return UserDetailOutputSchema.parse({
      // 1. Fields trực tiếp từ bảng users
      id: model.id,
      name: model.name,
      email: model.email,
      phone: model.phone,
      role: model.role,
      loyalty_points: model.loyalty_points ?? 0,
      is_active: model.is_active ?? true,
      created_at: model.created_at.toISOString(),
      updated_at: model.updated_at?.toISOString() ?? null,

      // 2. Relations: Addresses (nếu repository có include)
      addresses: (model.addresses || []).map((addr) => this.#mapAddress(addr)),

      // 3. Relations: Health Profile (nếu repository có include)
      // Chú ý: trong DB tên là `user_health_profiles`, map đúng tên key trong schema
      user_health_profiles: this.#mapHealthProfile(model.user_health_profiles),
    });
  }
}

module.exports = UserMapper;
