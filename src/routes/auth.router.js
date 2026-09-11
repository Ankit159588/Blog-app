import { Router } from "express";
import * as authcontroller from "../controller/auth.controller.js"

const authRouter = Router()

authRouter.post("/register", authcontroller.register)

authRouter.post("/verify-email", authcontroller.verifyEmail)

export default authRouter
