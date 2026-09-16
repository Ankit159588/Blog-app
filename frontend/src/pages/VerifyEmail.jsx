import { useState } from "react";
import { VerifyEmailUser } from "../services/api";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.userEmail;
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const data = {
        otp,
        email,
      };

      const response = await VerifyEmailUser(data);
      if (!response.success) {
        console.log(response.data.message);
        return;
      }
      navigate("/login");
      console.log(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container">
      <div className="auth-card">
        <div className="auth-card__eyebrow">One more step</div>

        <h1>Verify your email</h1>

        <p className="subtitle">
          We sent a 6-digit code to your email. Enter it below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field field-otp">
            <label htmlFor="otp">Verification code</label>

            <input
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
            />
          </div>

          <button type="submit" className="btn btn--block">
            Verify
          </button>
        </form>

        <div className="form-footer">
          Didn't get a code?{" "}
          <button
            type="button"
            className="btn btn--ghost"
            style={{ padding: 0 }}
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  );
}
