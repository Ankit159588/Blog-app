import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreatePost from "./pages/createPost.jsx";
import { useEffect, useState } from "react";
import { refreshAccessToken } from "./services/api";
import ErrorToast from "./components/ErrorToast";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = async () => {
      const response = await refreshAccessToken();

      if (!response.success) {
        return;
      }

      setAccessToken(response.data.accessToken);
    };

    refresh();
  }, []);

  return (
    <>
      {error && (
        <ErrorToast message={error} duration={5} onClose={() => setError("")} />
      )}

      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />

          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            path="/login"
            element={<Login setAccessToken={setAccessToken} />}
          />

          <Route
            path="/"
            element={
              <Home accessToken={accessToken} setAccessToken={setAccessToken} />
            }
          />

          <Route
            path="/create-post"
            element={
              <CreatePost
                accessToken={accessToken}
                setAccessToken={setAccessToken}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
