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

export async function getAllPosts(req, res) {
  try {
    const posts = await postModel.find({
      author: req.user.id
    });

    return res.status(200).json({
      posts
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: error,
      message: "Failed to get posts"
    });
  }
}

export async function getPostById(req, res) {
  try {
    const postId = req.params.id;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    return res.status(200).json({
      post
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to get post by id",
      error: error
    });
  }
}

export async function deletePostById(req, res) {
  try {

    const postId = req.params.id;

    const post = await postModel.findByIdAndDelete({
      _id: postId,
      author: req.user.id
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      messsage: "Failed to delete the post by id",
      error: error
    })
  }
}

export async function deleteAllPosts(req, res) {
  try {
    const result = await postModel.deleteMany({
      author: req.user.id
    });

    return res.status(200).json({
      message: "All posts deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to delete all posts",
      error: error
    });
  }
}

export async function updatePost(req, res) {
  try {
    const postId = req.params.id
    const { title, content } = req.body

    const post = await postModel.findOneAndUpdate({
      _id: postId,
      author: req.user.id
    }, {
      title,
      content
    }, {
      new: true,
      runValidators: true
    })

    if (!post) {
      return res.status(404).json({
        message: "Post not found or you are not the owner"
      });
    }

    return res.status(200).json({
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update post",
      error: error
    });
  }
}






