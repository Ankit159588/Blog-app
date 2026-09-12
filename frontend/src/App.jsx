import Register from "./pages/Register";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VerifyEmail from "./pages/VerifyEmail";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
