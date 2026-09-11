import { Router } from "express";
import * as postcontroller from "../controller/post.controller.js"
import multer from "multer"
import { authMiddleware } from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage()
const upload = multer({
  storage: storage
})
const postRouter = Router()

postRouter.post("/posts", authMiddleware, upload.single("image"), postcontroller.addPost)

export default postRouter;
