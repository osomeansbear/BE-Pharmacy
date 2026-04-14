const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/user.repository.js");
const accountService = require("./account.service.js");
const AccountRepository = require("../repositories/account.repository.js");
const PatientProfileRepository = require("../repositories/patient-profile.repository.js");

const { generateToken } = require("../utils/jwt.js");
const UserMapper = require("../mappers/user.mapper.js");
const userService = {
  async register(data) {
    const { fullName, email, password, phone, dob } = data;

    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Create new user
    const newUser = await UserRepository.create({
      fullName,
      email,
      phone,
      dob: new Date(dob),
      role: "PATIENT",
    });
    await accountService.createAccount(newUser.id, password);

    const createdUser = await UserRepository.findByIdWithProfile(newUser.id);

    return {
      user: UserMapper.mapToDetail(createdUser),
    };
  },

  async deleteUser(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    // Soft delete: deactivate user instead of hard delete
    const deactivatedUser = await UserRepository.deactivateUser(id);
    return {
      message: "User deactivated successfully",
      user: UserMapper.mapToDetail(deactivatedUser),
    };
  },

  async updateUser(id, data) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await UserRepository.update(Number(id), data);
    const updatedUser = await UserRepository.findByIdWithProfile(id);
    return {
      user: UserMapper.mapToDetail(updatedUser),
      message: "User updated successfully",
    };
  },

  async getMe(userId) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const user = await UserRepository.findByIdWithProfile(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    return {
      user: UserMapper.mapToDetail(user),
      message: "Profile retrieved successfully",
    };
  },

  async updateMe(userId, data) {
    if (!userId) {
      const err = new Error("Unauthorized");
      err.statusCode = 401;
      throw err;
    }

    const user = await UserRepository.findById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    await UserRepository.update(Number(userId), data);
    const updatedUser = await UserRepository.findByIdWithProfile(userId);

    return {
      user: UserMapper.mapToDetail(updatedUser),
      message: "Profile updated successfully",
    };
  },

  async getUserById(id) {
    const user = await UserRepository.findByIdWithProfile(id);
    if (!user) {
      throw new Error("User not found");
    }
    return { user: UserMapper.mapToDetail(user), message: "User found" };
  },

  async getAllUsers() {
    const users = await UserRepository.findAllWithProfile();
    if (!users || users.length === 0) {
      throw new Error("No user");
    }

    return { users: UserMapper.mapToList(users), message: "All users" };
  },

  async setUserStatus(id, isActive) {
    const user = await UserRepository.findById(Number(id));
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const updatedUser = isActive
      ? await UserRepository.activateUser(id)
      : await UserRepository.deactivateUser(id);

    return {
      user: UserMapper.mapToDetail(updatedUser),
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    };
  },

  async setUserRole(id, role) {
    const user = await UserRepository.findById(Number(id));
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    await UserRepository.update(Number(id), { role });
    const updatedUser = await UserRepository.findByIdWithProfile(id);

    return {
      user: UserMapper.mapToDetail(updatedUser),
      message: "User role updated successfully",
    };
  },

  async getHealthProfile(userId) {
    const profile = await PatientProfileRepository.findByUserId(userId);

    return {
      healthProfile: profile
        ? {
            allergies: profile.allergies || "",
            chronicDiseases: profile.chronicDiseases || "",
            context: profile.context || "",
          }
        : { allergies: "", chronicDiseases: "", context: "" },
      message: "Health profile retrieved",
    };
  },

  async upsertHealthProfile(userId, data) {
    const profile = await PatientProfileRepository.upsertByUserId(userId, data);

    return {
      healthProfile: {
        allergies: profile.allergies || "",
        chronicDiseases: profile.chronicDiseases || "",
        context: profile.context || "",
      },
      message: "Health profile updated",
    };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const isMatch = await accountService.compareEntityPassword(userId, currentPassword);
    if (!isMatch) {
      const err = new Error("Current password is incorrect");
      err.statusCode = 400;
      throw err;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const account = await AccountRepository.findByUserId(userId);
    await AccountRepository.update(account.id, { password: hashedPassword });

    return { message: "Password changed successfully" };
  },

  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("Email and password cannot be empty");
    }

    const user = await UserRepository.findByEmailWithProfile(email);
    if (!user) {
      throw new Error("No user found");
    }

    if (!user.isActive) {
      const err = new Error("User account is inactive");
      err.statusCode = 403;
      throw err;
    }

    const isMatch = await accountService.compareEntityPassword(
      user.id,
      password,
    );

    if (!isMatch) {
      throw new Error("Password incorrect");
    }
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    });

    return UserMapper.mapToLogin(user, token);
  },
};

module.exports = userService;
