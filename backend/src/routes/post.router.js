import { Router } from "express";
import * as postcontroller from "../controller/post.controller.js";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.middleware.js";

const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});
const postRouter = Router();

postRouter.post(
  "/posts",
  authMiddleware,
  upload.single("image"),
  postcontroller.addPost,
);

postRouter.get("/get-all-posts", authMiddleware, postcontroller.getAllPosts);

postRouter.get("/get-post/:id", authMiddleware, postcontroller.getPostById);

postRouter.delete(
  "/delete-post/:id",
  authMiddleware,
  postcontroller.deletePostById,
);

postRouter.delete(
  "/delete-all-posts",
  authMiddleware,
  postcontroller.deletePostById,
);

postRouter.patch("/update-post/:id", authMiddleware, postcontroller.updatePost);

export default postRouter;
