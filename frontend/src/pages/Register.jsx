import { useState } from "react";
import { registerUser } from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const userData = {
        username,
        email,
        password,
      };

      const response = await registerUser(userData);

      if (!response.success) {
        console.log(response.data.message);
        return;
      }
      console.log(response.data);

      navigate("/verify-email", {
        state: {
          userEmail: response.data.user.email,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-card__eyebrow">New here</div>
        <h1>Create an account</h1>
        <p className="subtitle">Join to start writing and reading posts.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              id="username"
              type="text"
              placeholder="jane_doe"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              id="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              id="password"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn--block">
            Create account
          </button>
        </form>

        <div className="form-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
