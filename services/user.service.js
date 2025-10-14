const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository.js");

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

    // Generate JWT token
    const token = jwt.sign(
      { id: Number(newUser.id), email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );
    return {
      message: "User registered successfully",
      user: {
        id: Number(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    };
  },
};

module.exports = userService;
