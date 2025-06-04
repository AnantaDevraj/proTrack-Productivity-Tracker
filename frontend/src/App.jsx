import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";

const token = localStorage.getItem("authToken");

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
      <BrowserRouter>
        <Navbar />
        <div>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {token ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Navigate to="/" />} />
                <Route path="/profile" element={<Navigate to="/" />} />
              </>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
