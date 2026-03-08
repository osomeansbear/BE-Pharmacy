const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/user.repository.js");
const accountService = require("./account.service.js");

const { generateToken } = require("../utils/jwt.js");
const UserMapper = require("../mappers/user.mapper.js");
const userService = {
  async register(data) {
    const { fullName, email, password, phone, role } = data;
    console.log(data);

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
      role,
    });
    await accountService.createAccount(newUser.id, password);

    return {
      user: newUser,
    };
  },

  async deleteUser(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    await UserRepository.delete(id);
    return { message: "User deleted successfully", userId: id };
  },

  async updateUser(id, data) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await UserRepository.update(id, data);
    return { User: updatedUser, message: "User updated successfully" };
  },

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    delete user.password;
    // user = {
    //   id: Number(user.id),
    //   name: user.name,
    //   email: user.email,
    //   role: user.role,
    // };
    return { User: user, message: "User found" };
  },

  async getAllUsers() {
    const users = await UserRepository.findAll();
    if (!users) {
      throw new Error("No user");
    }
    for (i = 0; i < users.length; i++) {
      users[i].id = Number(users[i].id);
      delete users[i].password;
    }
    return { Users: users, message: "All users" };
  },

  async loginUser(email, password) {
    if (!email || !password) {
      throw new Error("Email and password cannot be empty");
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("No user found");
    }

    const isMatch = await accountService.compareEntityPassword(
      user.id,
      password,
    );

    if (!isMatch) {
      throw new Error("Password incorrect");
    }
    const token = generateToken(user);
    const loginuser = { user, token };
    // loginuser (user,token)

    return loginuser;
  },
};

module.exports = userService;
