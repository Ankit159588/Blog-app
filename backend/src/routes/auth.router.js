import { Router } from "express";
import * as authcontroller from "../controller/auth.controller.js"

const authRouter = Router()

authRouter.post("/register", authcontroller.register)

authRouter.post("/verify-email", authcontroller.verifyEmail)

authRouter.post("/login", authcontroller.login)

authRouter.get("/refresh", authcontroller.rotateToken)

authRouter.get("/logout", authcontroller.logout)

export default authRouter
