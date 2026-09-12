import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userEmailVerify } from "../services/api";
const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleResend = () => {
    navigate("/register");
  };

  const email = location.state?.userEmail;

  const [otp, setOtp] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      otp,
    };

    const data = await userEmailVerify(userData);
    console.log(data);
  };

  return (
    <div>
      <div className="verify-page">
        <h1>Simple Blog App</h1>
        <div className="verify-card">
          <h2>Verify Your Email</h2>
          <p className="verify-subtitle">
            {" "}
            We have sent a verification code to your {email}. Enter the code
            below to verify your account.{" "}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label> Verificaiton Code </label>
              <input
                type="text"
                placeholder="Enter 6 digit OTP"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="submit">Verify Email</button>
          </form>
          <p className="resend-text">
            Didn't receive the code?{" "}
            <span onClick={handleResend}>Resend OTP</span>
          </p>{" "}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
