import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

import PostList from "./pages/Posts/PostList.jsx";
import PostDetail from "./pages/Posts/PostDetail.jsx";
import PostForm from "./pages/Posts/PostForm.jsx";

import { refreshAccessToken } from "./services/api";

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check refresh token when app starts
  useEffect(() => {
    async function refresh() {
      const response = await refreshAccessToken();

      if (!response.success) {
        console.log("Refresh failed");
        setAuthLoading(false);
        return;
      }

      setAccessToken(response.data.accessToken);
      setAuthLoading(false);
    }

    refresh();
  }, []);

  // Automatically refresh access token when it expires
  useEffect(() => {
    if (!accessToken) return;

    const decoded = jwtDecode(accessToken);
    const expiresAt = decoded.exp * 1000;

    console.log("NEW ACCESS TOKEN RECEIVED");
    console.log("Token expires at:", new Date(expiresAt));

    const interval = setInterval(async () => {
      const remaining = Math.ceil((expiresAt - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(interval);

        console.log("Token expired. Refreshing...");

        const response = await refreshAccessToken();

        if (!response.success) {
          console.log("REFRESH FAILED");
          return;
        }

        console.log("REFRESH DONE");

        setAccessToken(response.data.accessToken);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <div className="page">
      <Navbar />

      <main className="main">
        <Routes>
          {/* Public routes */}

          <Route path="/register" element={<Register />} />

          <Route
            path="/login"
            element={<Login setAccessToken={setAccessToken} />}
          />

          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected routes */}

          <Route
            path="/"
            element={
              <ProtectedRoute
                accessToken={accessToken}
                authLoading={authLoading}
              >
                <PostList accessToken={accessToken} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/new"
            element={
              <ProtectedRoute
                accessToken={accessToken}
                authLoading={authLoading}
              >
                <PostForm accessToken={accessToken} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/:id"
            element={
              <ProtectedRoute
                accessToken={accessToken}
                authLoading={authLoading}
              >
                <PostDetail accessToken={accessToken} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/posts/:id/edit"
            element={
              <ProtectedRoute
                accessToken={accessToken}
                authLoading={authLoading}
              >
                <PostForm accessToken={accessToken} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
