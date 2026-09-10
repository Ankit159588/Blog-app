import config from "../config/config.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import { sendEmail } from "../services/email.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyExists = await userModel.findOne({
    $or: [{ username: username }, { email: email }]
  })

  if (isAlreadyExists) {
    return res.status(400).json({
      message: "Username or Email already exists"
    })
  }

  const hashPassword = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    username: username,
    email: email,
    password: hashPassword
  })

  const otp = generateOtp();
  const html = getOtpHtml(otp)

  await sendEmail(
    user.email,
    "Verify your email",
    `Your OTP is ${otp}`,
    getOtpHtml(otp)
  );
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      username: user.username,
      email: user.email
    }
  });

}

