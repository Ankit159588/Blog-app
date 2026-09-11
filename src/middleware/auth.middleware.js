import jwt from "jsonwebtoken"
import config from "../config/config.js"

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(accessToken, config.JWT_SECRET)

    req.user = decoded

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}
