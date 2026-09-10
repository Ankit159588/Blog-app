import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title of the blog is required"],
      trim: true
    },

    content: {
      type: String,
      required: [true, "Content of the blog is required"]
    },

    image: {
      type: String,
      default: "default image url"
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const postModel = mongoose.model("Post", postSchema);

export default postModel;
