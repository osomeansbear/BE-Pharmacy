const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/user.repository.js");
const { generateToken } = require("../utils/jwt.js");

const userService = {
  async register(data) {
    const { name, email, password, phone } = data;

    // Check if email already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    return {
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user);
    return {
      user: { ...user, id: Number(user.id) },
      token,
      message: "Login Successful",
    };
  },
};

module.exports = userService;
