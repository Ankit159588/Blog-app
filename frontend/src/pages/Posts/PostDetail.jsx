import { Link, useNavigate, useParams } from "react-router-dom";
import { deletePostById, getPostById } from "../../services/api";
import { useEffect, useState } from "react";

export default function PostDetail({ accessToken }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(id, accessToken);

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

  async function handleDelete() {
    try {
      const response = await deletePostById(id, accessToken);

      if (!response.success) {
        console.log(response.data);
        return;
      }

      navigate("/"); // post is gone, don't leave the user on a dead page
    } catch (error) {
      console.log("Post failed to delete", error);
    }
  }

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

        <button
          onClick={handleDelete}
          type="button"
          className="btn btn--danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
