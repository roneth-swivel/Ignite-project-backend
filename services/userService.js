import User from "../model/userModel.js";
const logger = require("../utils/logger");

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
