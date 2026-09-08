import userModel from "../model/user.model.js";
import { generateOtp, getOtpHtml } from "../utils/utils.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import config from "../config/config.js";
import sessionModel from "../model/session.model.js";
import otpModel from "../model/otp.model.js";
import { sendEmail } from "../services/email.service.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isAlreadyRegistered = await userModel.findOne(
    {
      $or: [{ username }, { email }]
    }
  )

  if (isAlreadyRegistered) {
    return res.status(409).json({
      message: "Username or email already exists"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await userModel.create({
    username, email, password: hashedPassword
  })

  const otp = generateOtp();
  const html = getOtpHtml(otp);

  const otpHash = await bcrypt.hash(otp, 10);
  await otpModel.create({
    email,
    user: user._id,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  })

  await sendEmail(email, "OTP Varification", `Your OTP code is ${otp}`, html)

  res.status(201).json({
    message: "User create successfully",
    user: {
      username: user.username,
      email: user.email
    },
  })

}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({
    email,
    verified: true,
  })

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    })
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    })
  }

  const refreshToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  })

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10)

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  })

  const accessToken = jwt.sign({ id: user._id, session_id: session._id }, config.JWT_SECRET, {
    expiresIn: "15m",
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

export async function getMe(req, res) {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      message: "Access token is required"
    })
  }

  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET)

    const user = await userModel.findById(
      decoded.id
    )

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        username: user.username,
        email: user.email
      }
    })
  } catch (error) {
    return res.status(401).json({
      message: "Token is Invalid or expired"
    })
  }

}


export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token not found",
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET);

    // Get active sessions for this user
    const sessions = await sessionModel.find({
      user: decoded.id,
      revoked: false,
    });

    // Find the session that matches the refresh token
    let currentSession = null;

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(
        refreshToken,
        session.refreshTokenHash
      );

      if (isMatch) {
        currentSession = session;
        break;
      }
    }

    if (!currentSession) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Find user
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Create new access token
    const accessToken = jwt.sign(
      {
        id: decoded.id,
        session_id: currentSession._id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Create new refresh token
    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      config.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Hash new refresh token
    const newRefreshTokenHash = await bcrypt.hash(
      newRefreshToken,
      10
    );

    // Update session
    currentSession.refreshTokenHash = newRefreshTokenHash;

    await currentSession.save();

    // Replace old cookie with new refresh token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      accessToken,
    });

  } catch (error) {
    return res.status(401).json({
      message: "Refresh token expired or invalid",
    });
  }
}



export async function logout(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found"
    })
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.JWT_SECRET)
  } catch (error) {
    return res.status(401).json({
      message: "Refresh token expired or invalid"
    })
  }

  const sessions = await sessionModel.find({
    user: decoded.id,
    revoked: false
  })

  let currentSession = null;
  for (const session of sessions) {
    const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash)

    if (isMatch) {
      currentSession = session;
      break;
    }
  }

  if (!currentSession) {
    return res.status(401).json({
      message: "Invalid refresh token"
    });
  }

  currentSession.revoked = true;
  await currentSession.save()

  res.clearCookie("refreshToken")

  return res.status(200).json({
    message: "Logged out successfully"
  });
}


export async function logoutAll(req, res) {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh token not found"
    })
  }

  try {

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET)

    await sessionModel.updateMany({
      user: decoded.id,
      revoked: false
    }, {
      revoked: true
    })

    res.clearCookie("refreshToken")
    return res.status(200).json({
      message: "logged out successfully from all devices"
    })
  } catch (error) {
    return res.status(400).json({
      message: "Refresh token is invalid"
    })
  }

}

export async function verifyEmail(req, res) {
  const { otp, email } = req.body

  const otpDoc = await otpModel.findOne({
    email,
  }).sort({ createdAt: -1 })

  if (!otpDoc) {
    return res.status(400).json({
      message: "OTP not found"
    })
  }

  if (otpDoc.expiresAt < new Date()) {
    return res.status(400).json({
      message: "OTP is expired"
    })
  }

  console.log("OTP received:", otp);
  console.log("OTP document:", otpDoc);
  console.log("OTP hash:", otpDoc.otpHash);

  const isMatch = await bcrypt.compare(otp, otpDoc.otpHash);
  if (!isMatch) {
    return res.status(400).json({
      message: "OTP is Invalid"
    })
  }

  await userModel.findOneAndUpdate({
    email
  }, { verified: true })

  await otpModel.findByIdAndDelete(otpDoc._id);

  return res.status(200).json({
    message: "Email varified successfully"
  })

}

















