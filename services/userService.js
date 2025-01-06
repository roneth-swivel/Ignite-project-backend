import User from "../model/userModel.js";
import { logger } from "../utils/logger.js";

export const create = async (user) => {
  const { email, phoneNumber } = user;

  // Check for existing user by email or phone number
  const userExist = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (userExist) {
    logger.info("Email or Phone number Already Exists");

    return {
      statusCode: 400,
      email: userExist.email,
      isExisting: userExist.email === email,
      message:
        userExist.email === email
          ? "User with this email already exists."
          : "User with this phone number already exists.",
    };
  } else {
    const newUser = new User(user);
    const savedData = await newUser.save();
    return {
      statusCode: 200,
      message: "User created successfully.",
      userId: savedData._id,
    };
  }
};

export const getAllUsers = async (queryParams) => {
  const { page = 2, limit = 10 } = queryParams;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const userData = await User.find();
  const total = await User.countDocuments();

  if (!userData || userData.length === 0) {
    return {
      users: [],
      statusCode: 404,
      message: "No users found.",
    };
  } else {
    return {
      users: userData,
      totalUsers: total,
      currentPage: options.page,
      totalPages: Math.ceil(total / options.limit),
      statusCode: 200,
    };
  }
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    return {
      user: [],
      statusCode: 404,
      message: "No users found.",
    };
  } else {
    return {
      statusCode: 200,
      user: user,
    };
  }
};

export const update = async (id, user) => {
  const userExist = await getUserById(id);

  if (!userExist) {
    return {
      user: [],
      statusCode: 404,
      message: "No users found.",
    };
  }

  // Prevent updating email or phone to an existing value
  const { email, phoneNumber } = user;
  if (email) {
    const emailExists = await User.findOne({
      email,
      _id: { $ne: id },
    });
    if (emailExists) {
      return {
        user: [],
        statusCode: 400,
        message: "Email already in use.",
      };
    }
  }
  if (phoneNumber) {
    const phoneExists = await User.findOne({
      phoneNumber,
      _id: { $ne: id },
    });
    if (phoneExists) {
      return {
        user: [],
        statusCode: 400,
        message: "Phone number already in use.",
      };
    }
  }

  const updatedData = await User.findByIdAndUpdate(id, user, {
    new: true,
    runValidators: true,
  });

  if (updatedData) {
    return {
      user: updatedData,
      statusCode: 200,
      message: "User updated successfully.",
    };
  } else {
    logger.error("Error Updating User");
  }
};

export const deleteUser = async (id) => {
  const userExist = await User.findById(id);
  if (!userExist) {
    return {
      user: [],
      statusCode: 404,
      message: "User not found.",
    };
  } else {
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      return {
        user: deletedUser,
        statusCode: 200,
        message: "User deleted successfully.",
      };
    } else {
      logger.error("Error Deleting User");
    }
  }
};
