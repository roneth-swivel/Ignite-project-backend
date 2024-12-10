import mongoose from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - gender
 *       properties:
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: User's email address
 *           example: johndoe@example.com
 *         phoneNumber:
 *           type: string
 *           description: User's phone number in Sri Lankan format
 *           example: +94771234567
 *         gender:
 *           type: string
 *           enum: ["M", "F"]
 *           description: User's gender
 *           example: M
 */
const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    match: [/^[A-Za-z]{6,10}$/, "First name must be 6-10 alphabets only"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    match: [/^[A-Za-z]{6,10}$/, "Last name must be 6-10 alphabets only"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please enter a valid email address",
    ],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    match: [
      /^(?:\+94|94|0)?(7[0-9]{8})$/,
      "Please enter a valid Sri Lankan phone number",
    ],
  },
  gender: {
    type: String,
    enum: ["M", "F"],
    required: [true, "Gender is required"],
  },
});

export default mongoose.model("Employee", employeeSchema);
