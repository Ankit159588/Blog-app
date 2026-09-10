import { Router } from "express";
import * as authcontroller from "../controller/auth.controller.js"

const authRouter = Router()

authRouter.post("/register", authcontroller.register)

export default authRouter
