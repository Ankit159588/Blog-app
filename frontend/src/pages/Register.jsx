import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
    };

    const data = await registerUser(userData);
    console.log(data);

    if (data) {
      navigate("/verify-email", {
        state: {
          userEmail: email,
        },
      });
    }
  };
  return (
    <div className="register-page">
      <h1>Simple Blog App</h1>
      <h2>Create Account</h2>
      <p className="register-subtitle">
        {" "}
        Create your account and start sharing your thoughts.{" "}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label> Username </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label> Email </label>
          <input
            type="email"

            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            value={email}
          />
        </div>
        <div className="form-group">
          <label> Password </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Create Account </button>
      </form>

      <p className="login-text">
        Already have an account?{" "}
        <span onClick={handleLoginRedirect}> login</span>
      </p>
    </div>
  );
};

export default Register;
