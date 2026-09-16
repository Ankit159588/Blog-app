import { Link, useParams } from "react-router-dom";
import { getPostById } from "../../services/api";
import { useEffect, useState } from "react";

export default function PostDetail({ accessToken }) {
  const { id } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(id, accessToken);

        console.log("POST RESPONSE:", response);

        if (!response.success) {
          console.log(response.data);
          return;
        }

        setPost(response.data.post);
      } catch (error) {
        console.log("Failed to fetch the post", error);
      }
    }

    if (accessToken) {
      fetchPost();
    }
  }, [accessToken, id]);

  // Don't render post data until API response arrives
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <Link
        to="/"
        className="btn btn--ghost"
        style={{ padding: 2, marginBottom: 24 }}
      >
        ← Back to posts
      </Link>

      <img src={post.image} alt={post.title} className="post-detail__image" />

      <h1>{post.title}</h1>

      <div className="post-detail__meta">by {post.author.username}</div>

      {post.content.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}

      <div className="post-detail__actions">
        <Link to={`/posts/${post._id}/edit`} className="btn btn--ghost">
          Edit
        </Link>

        <button type="button" className="btn btn--danger">
          Delete
        </button>
      </div>
    </div>
  );
}
