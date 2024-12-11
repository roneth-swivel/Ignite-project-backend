import User from "../model/userModel.js";

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const create = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const { email, phoneNumber } = newUser;

    // Check for existing user by email or phone number
    const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExist) {
      const errorMessage =
        userExist.email === email
          ? "User with this email already exists."
          : "User with this phone number already exists.";
      return res.status(400).json({ message: errorMessage });
    }

    const savedData = await newUser.save();
    res.status(201).json({
      message: "User created successfully.",
      userId: savedData._id,
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
 * Retrieve all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
    };

    const userData = await User.find()
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

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
