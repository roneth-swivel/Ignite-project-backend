import User from "../model/userModel.js";
import * as UserService from "../services/userService.js";
const logger = require("../utils/logger");

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  try {
    const createdUser = await UserService.create(req.body);
    return res.status(createdUser.statusCode).json(createdUser);
  } catch (error) {
    logger.error("Create User Error", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: errors,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
};

/**
 * Retrieve all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 2, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const userData = await User.find();

    const total = await User.countDocuments();

    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      users: userData,
      totalUsers: total,
      currentPage: options.page,
      totalPages: Math.ceil(total / options.limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
};

/**
 * Retrieve user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(userExist);
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
};

/**
 * Update user details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prevent updating email or phone to an existing value
    const { email, phoneNumber } = req.body;
    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: id },
      });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use." });
      }
    }
    if (phoneNumber) {
      const phoneExists = await User.findOne({
        phoneNumber,
        _id: { $ne: id },
      });
      if (phoneExists) {
        return res
          .status(400)
          .json({ message: "Phone number already in use." });
      }
    }

    const updatedData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedData,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: errors,
      });
    }
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findById(id);
    if (!userExist) {
      return res.status(404).json({ message: "User not found." });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid User ID format." });
    }
    res.status(500).json({
      message: "Internal Server Error",
      errorMessage: error.message,
    });
  }
};
