import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../../services/api";

function excerpt(text, length = 110) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

export default function PostList({ accessToken }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await getAllPosts(accessToken);

        if (!response.success) {
          console.log(response.data);
          return;
        }

        setPosts(response.data.posts);
      } catch (error) {
        console.log("Failed to fetch posts:", error);
      }
    }

    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken]);

  return (
    <div className="container container--wide">
      <div className="posts-header">
        <div>
          <h1>Posts</h1>
          <p>Everything written so far, newest first.</p>
        </div>

        <Link to="/posts/new" className="btn">
          Write a post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>No posts yet. Be the first to write one.</p>
        </div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <Link
              key={post._id}
              to={`/posts/${post._id}`}
              className="post-card"
            >
              <img
                src={post.image}
                alt={post.title}
                className="post-card__image"
              />

              <div className="post-card__title">{post.title}</div>

              <p className="post-card__excerpt">{excerpt(post.content)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
