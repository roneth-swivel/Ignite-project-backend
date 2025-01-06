import User from "../model/userModel.js";
import * as UserService from "../services/userService.js";
import { logger } from "../utils/logger.js";

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
    logger.error(`Create User Error ${error}`);

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
    const users = await UserService.getAllUsers(req.query);
    return res.status(users.statusCode).json(users);
  } catch (error) {
    logger.error(`User List Error ${error}`);
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
    const users = await UserService.getUserById(req.params.id);
    return res.status(users.statusCode).json(users.users);
  } catch (error) {
    logger.error(`Get User By Id Error ${error}`);

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
    const updatedUser = await UserService.update(req.params.id, req.body);
    return res.status(updatedUser.statusCode).json(updatedUser);
  } catch (error) {
    logger.error(`Update User Error ${error}`);

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
    const deleteUser = await UserService.deleteUser(req.params.id);
    return res.status(deleteUser.statusCode).json(deleteUser);
  } catch (error) {
    logger.error(`Delete User Error ${error}`);

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
