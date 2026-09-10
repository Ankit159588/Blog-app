import { uploadImage } from "../services/imageKit.service.js";

export async function addPost(req, res) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {

      return res.status(400).json({
        message: "Image is required"
      });
    }

    console.log("Buffer size:", req.file.buffer.length);

    const imageUrl = await uploadImage(
      req.file.buffer,
      req.file.originalname
    );

    return res.status(201).json({
      message: "Post created successfully",
      body: req.body,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.log("ERROR:", error);

    return res.status(500).json({
      message: "Image upload failed",
      error: error.message
    });
  }
}
