export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}


export function getOtpHtml(otp) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your OTP</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, sans-serif;
      ">
        <div style="
          max-width: 500px;
          margin: 40px auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
        ">
          
          <h2 style="color: #333;">
            Verify Your Email
          </h2>

          <p style="color: #555; font-size: 16px;">
            Use the OTP below to verify your email address.
          </p>

          <div style="
            margin: 25px 0;
            padding: 15px;
            background-color: #f1f1f1;
            border-radius: 8px;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #222;
          ">
            ${otp}
          </div>

          <p style="color: #777; font-size: 14px;">
            This OTP will expire in 5 minutes.
          </p>

          <p style="color: #999; font-size: 12px;">
            If you didn't request this OTP, you can safely ignore this email.
          </p>

        </div>
      </body>
    </html>
  `;
}
