import { useEffect, useState } from "react";
import { getMe } from "../services/api";

export default function Profile({ accessToken }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function userDetails() {
      try {
        const response = await getMe(accessToken);

        if (!response.success) {
          console.log(response.data?.message);
          return;
        }

        setUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    }

    userDetails();
  }, [accessToken]);

  if (!user) {
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-card">
        <div className="profile-card__avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <h1>{user.username}</h1>
        <p className="profile-card__email">{user.email}</p>
      </div>
    </div>
  );
}
