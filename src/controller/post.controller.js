import { uploadImage } from "../services/imageKit.service.js";
import userModel from "../model/user.model.js";
import postModel from "../model/post.model.js";

export async function addPost(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, content } = req.body;
    const author = req.user.id;


    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required"
      });
    }


    if (!req.file) {
      return res.status(400).json({
        message: "Image is required"
      });
    }

    const imageUrl = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );

    const post = await postModel.create({
      title: title,
      content: content,
      image: imageUrl,
      author: author
    })

    return res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: "Image upload failed",
      error: error.message
    });
  }
}
