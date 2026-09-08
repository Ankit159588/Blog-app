import { Router } from "express";
import * as authcontroller from "../authcontroller/auth.controller.js"

const authRouter = Router()

authRouter.post("/register", authcontroller.register)

authRouter.post("/login", authcontroller.login)

authRouter.get("/get-me", authcontroller.getMe)

authRouter.get("/refresh-token", authcontroller.refresh)

authRouter.get("/logout", authcontroller.logout)

authRouter.get("/logout-all", authcontroller.logoutAll)

authRouter.post("/verify-email", authcontroller.verifyEmail)

export default authRouter;

