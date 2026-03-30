const {
  UserListOutputSchema,
  UserDetailOutputSchema,
  UserLoginOutputSchema,
} = require("../validators/output/user.output.validator");

class UserMapper {
  static #mapAddress(addr) {
    if (!addr) return null;
    return {
      id: addr.id,
      userId: addr.userId,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      detail: addr.detail,
      isDefault: addr.isDefault,
    };
  }

  static #mapPatientProfile(profile) {
    if (!profile) return null;
    return {
      id: profile.id,
      userId: profile.userId,
      context: profile.context,
    };
  }

  static mapToLogin(model, token) {
    return UserLoginOutputSchema.parse({
      id: model.id,
      email: model.email,
      fullName: model.fullName,
      phone: model.phone,
      role: model.role,
      isActive: model.isActive,
      addresses: (model.address || model.addresses || []).map((addr) =>
        this.#mapAddress(addr),
      ),
      token,
    });
  }

  static mapToListItem(model) {
    return UserListOutputSchema.parse({
      id: model.id,
      email: model.email,
      fullName: model.fullName,
      phone: model.phone,
      role: model.role,
      isActive: model.isActive,
      createdAt: model.createdAt.toISOString(),
    });
  }

  static mapToList(models) {
    return models.map((m) => this.mapToListItem(m));
  }

  static mapToDetail(model) {
    return UserDetailOutputSchema.parse({
      id: model.id,
      email: model.email,
      fullName: model.fullName,
      phone: model.phone,
      role: model.role,
      isActive: model.isActive,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt.toISOString(),
      addresses: (model.address || model.addresses || []).map((addr) =>
        this.#mapAddress(addr),
      ),
      patientProfile: this.#mapPatientProfile(
        model.patientProfile || model.user_health_profiles,
      ),
    });
  }
}

module.exports = UserMapper;
