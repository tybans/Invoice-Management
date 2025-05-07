const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

exports.createUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userId = `${role.charAt(0)}${Date.now()}`;

    const existingUserId = await User.findOne({ userId });
    if (existingUserId) {
      return res
        .status(400)
        .json({ message: "User ID already exists, try again" });
    }

    const newUser = new User({
      name,
      email,
      role,
      password: hashedPassword,
      userId,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating user!",
      error,
    });
  }
};

exports.updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { role },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user role",
      error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await User.findOneAndDelete({ userId });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting user!",
      error,
    });
  }
};

exports.getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error,
    });
  }
};
