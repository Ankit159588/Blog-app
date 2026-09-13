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

// Hide these fields from API JSON response
postSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.createdAt;
    delete ret.updatedAt;
    delete ret.__v;

    return ret;
  }
});

const postModel = mongoose.model("Post", postSchema);

export default postModel;
