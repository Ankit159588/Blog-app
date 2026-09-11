import config from "../config/config.js";
import otpModel from "../model/otp.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import { sendEmail } from "../services/email.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const existingUser = await userModel.findOne({
    $or: [{ username: username }, { email: email }]
  })

  if (existingUser) {
    if (existingUser.verified) {
      return res.status(400).json({
        message: "Username or Email already exists"
      })
    }
  }

  if (existingUser && existingUser.verified === false) {

    const user = await userModel.findById(existingUser._id)

    const otp = generateOtp();
    const html = getOtpHtml(otp)
    const otpHash = await bcrypt.hash(otp, 10)

    otpModel.deleteMany({
      email: existingUser.email
    })

    await otpModel.create({
      email: existingUser.email,
      user: existingUser._id,
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    })

    await sendEmail(
      user.email,
      "Verify your email",
      `Your OTP is ${otp}`,
      html
    );
    return res.status(201).json({
      message: "User is not verfied a new otp has been sent",
      user: {
        username: user.username,
        email: user.email
      }
    });


  }

  const hashPassword = await bcrypt.hash(password, 10)
  const user = await userModel.create({
    username: username,
    email: email,
    password: hashPassword
  })

  const otp = generateOtp();
  const html = getOtpHtml(otp)
  const otpHash = await bcrypt.hash(otp, 10)

  await otpModel.create({
    email: user.email,
    user: user._id,
    otpHash: otpHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000)
  })

  await sendEmail(
    user.email,
    "Verify your email",
    `Your OTP is ${otp}`,
    html
  );
  return res.status(201).json({
    message: "User registered successfully",
    user: {
      username: user.username,
      email: user.email
    }
  });

}

export async function verifyEmail(req, res) {
  const { otp, email } = req.body

  const otpDoc = await otpModel.findOne({
    email,
  }).sort({ createdAt: -1 })

  if (!otpDoc) {
    return res.status(400).json({
      message: "Otp not found"
    })
  }

  if (otpDoc.expiresAt < new Date()) {
    return res.status(400).json({
      message: "OTP is expired"
    })
  }

  const isMatchOtp = await bcrypt.compare(otp, otpDoc.otpHash)

  if (!isMatchOtp) {
    return res.status(400).json({
      message: "OTP is Invalid"
    })
  }

  await userModel.findOneAndUpdate({
    email
  }, { verified: true })

  return res.status(200).json({
    message: "Email varified successfully"
  })

}
























