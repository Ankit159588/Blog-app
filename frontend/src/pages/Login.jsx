import { Link } from "react-router-dom";
import { useState } from "react";
import { LoginUser } from "../services/api";
import { useNavigate } from "react-router-dom/dist";

export default function Login({ setAccessToken }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const userData = {
        email,
        password,
      };

      const response = await LoginUser(userData);

      if (!response.success) {
        console.log(response.data.message);
        return;
      }
      setAccessToken(response.data.token);
      console.log(response.data);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-card__eyebrow">Welcome back</div>
        <h1>Log in</h1>
        <p className="subtitle">Pick up where you left off.</p>

        <form onSubmit={handleSubmit}>
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
            Log in
          </button>
        </form>

        <div className="form-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
