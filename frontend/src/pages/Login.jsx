import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/api";
import ErrorToast from "../components/ErrorToast";

const Login = ({ setAccessToken }) => {
  const navigate = useNavigate();

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    const response = await userLogin(userData);
    if (!response.success) {
      setError(response.data.message);
      return;
    }

    setAccessToken(response.data.accessToken);
    navigate("/");
    console.log(response);
  };

  return (
    <div className="login-page">
      {error && (
        <ErrorToast message={error} duration={5} onClose={() => setError("")} />
      )}
      <h1>Simple Blog App</h1>

      <h2>Welcome Back</h2>

      <p className="login-subtitle">
        Login to your account and continue sharing your thoughts.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="register-text">
        Don't have an account?{" "}
        <span onClick={handleRegisterRedirect}>Register</span>
      </p>
    </div>
  );
};

export default Login;
