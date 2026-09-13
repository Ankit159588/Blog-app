import config from "../config/config.js";
import sessionModel from "../model/session.model.js"
import otpModel from "../model/otp.model.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import userModel from "../model/user.model.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import { sendEmail } from "../services/email.service.js";
import mongoose from "mongoose";

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

    await otpModel.deleteMany({
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


export async function login(req, res) {
  const { email, password } = req.body

  const user = await userModel.findOne({
    email
  })

  if (!user) {
    return res.status(400).json({
      message: "User not found"
    })
  }

  if (user && !user.verified) {
    return res.status(400).json({
      message: "User found but not verified"
    })
  }

  const isValidPassword = await bcrypt.compare(password, user.password)

  if (!isValidPassword) {
    return res.status(400).json({
      message: "Password is invalid"
    })
  }

  const sessionId = new mongoose.Types.ObjectId()

  const refreshToken = jwt.sign({
    id: user._id,
    session_id: sessionId
  }, config.JWT_SECRET, {
    expiresIn: "7d"
  })

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

  const session = await sessionModel.create({
    _id: sessionId,
    user: user._id,
    refreshTokenHash: refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  })

  const accessToken = jwt.sign({
    id: user._id,
    session_id: session._id
  }, config.JWT_SECRET, {
    expiresIn: "15m"
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  res.status(200).json({
    message: "User logged in successfully",
    token: accessToken
  })

}


export async function rotateToken(req, res) {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found"
    })
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    const session = await sessionModel.findOne({
      _id: decoded.session_id,
      user: decoded.id,
      revoked: false
    })
    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const isValidRefreshToken = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash
    )

    if (!isValidRefreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token"
      })
    }
    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
        session_id: decoded.session_id
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10)

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();


    const accessToken = jwt.sign(
      {
        id: decoded.id,
        session_id: session._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );


    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "access token refreshed successfully",
      accessToken
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: "Refresh token expired or invalid"
    })
  }

}

export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found"
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    const session = await sessionModel.findOne({
      _id: decoded.session_id,
      user: decoded.id,
      revoked: false
    });

    if (!session) {
      return res.status(400).json({
        message: "Session not found"
      });
    }

    const isMatch = await bcrypt.compare(
      refreshToken,
      session.refreshTokenHash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid refresh token"
      });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "User logged out successfully"
    });

  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: "Invalid refresh token"
    });
  }
}

















