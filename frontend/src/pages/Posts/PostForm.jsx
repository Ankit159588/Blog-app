import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/api";

export default function PostForm({ accessToken }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);

      const response = await createPost(postData, accessToken);
      if (!response.success) {
        console.log(response.data.message);
        return;
      }
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.log("ERROR:", error);

      return res.status(500).json({
        message: "Post creation failed",
        error: error.message,
      });
    }
  }

  return (
    <div className="container">
      <h1>Write a new post</h1>

      <p style={{ marginBottom: 28 }}>
        Give it a title, a cover image, and write.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="title">Title</label>

          <input
            id="title"
            type="text"
            placeholder="Notes from a slow morning"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="image">Cover image</label>

          <label htmlFor="image" className="image-drop">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Selected cover"
                className="image-drop__preview"
              />
            ) : (
              "Click to choose an image"
            )}
          </label>

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="field">
          <label htmlFor="content">Content</label>

          <textarea
            id="content"
            className="field-textarea"
            placeholder="Start writing..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          Publish post
        </button>
      </form>
    </div>
  );
}
