import { Router } from "express";
import * as authcontroller from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", authcontroller.register);

authRouter.post("/verify-email", authcontroller.verifyEmail);

authRouter.post("/login", authcontroller.login);

authRouter.get("/refresh", authcontroller.rotateToken);

authRouter.get("/logout", authcontroller.logout);

authRouter.get("/getMe", authMiddleware, authcontroller.getMe);

export default authRouter;
