import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <div className="create-post-header">
          <button className="back-button" onClick={() => navigate("/")}>
            ← Back
          </button>

          <h1>Create Post</h1>
          <p>Share your thoughts with the world.</p>
        </div>

        <form className="create-post-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" placeholder="Enter your post title" />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea placeholder="Write your post..." rows="10"></textarea>
          </div>

          <div className="form-group">
            <label>Cover Image</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="create-post-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button type="submit" className="publish-button">
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
