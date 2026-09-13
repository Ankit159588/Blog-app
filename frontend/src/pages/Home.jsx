import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../services/api";

const Home = ({ accessToken, setAccessToken }) => {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!accessToken) {
        console.log("No access token");
        return;
      }

      console.log("Access token:", accessToken);

      const response = await getAllPosts(accessToken, setAccessToken);

      console.log("Posts response:", response);

      if (!response.success) {
        console.log("Error:", response.data.message);
        return;
      }

      console.log("Posts:", response.data.posts);

      setPosts(response.data.posts);
    };
    fetchPosts();
  }, [accessToken, setAccessToken]);

  return (
    <div className="home-page">
      <nav className="navbar">
        <h2 onClick={() => navigate("/")}>Simple Blog App</h2>

        <div className="nav-actions">
          <button onClick={() => navigate("/create-post")}>Create Post</button>

          <button>Logout</button>
        </div>
      </nav>

      <main className="blog-container">
        <section className="welcome-section">
          <h1>Welcome Back 👋</h1>
          <p>Share your thoughts with the world.</p>
        </section>

        <section className="posts-section">
          <div className="posts-header">
            <h2>Latest Posts</h2>
          </div>

          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <div className="posts-grid">
              {posts.map((post) => (
                <article className="post-card" key={post._id}>
                  <div className="post-image">
                    {post.image ? (
                      <img src={post.image} alt={post.title} />
                    ) : (
                      <span>No Image</span>
                    )}
                  </div>

                  <div className="post-content">
                    <h3>{post.title}</h3>

                    <p>{post.content}</p>

                    <div className="post-footer">
                      <span>By You</span>

                      <button>Read More</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
