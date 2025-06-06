import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import WeeklyStats from "./pages/WeeklyStats.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import EditTask from "./pages/EditTask.jsx";

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
                <Route path="/weekly-stats" element={<WeeklyStats />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/edit-task/:taskId" element={<EditTask />} />
              </>
            ) : (
              <>
                <Route path="/dashboard" element={<Navigate to="/" />} />
                <Route path="/profile" element={<Navigate to="/" />} />
                <Route path="/weekly-stats" element={<Navigate to="/" />} />
                <Route path="/create-task" element={<Navigate to="/" />} />
                <Route path="/edit-task/:taskId" element={<Navigate to="/" />} />
              </>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </div>
  );
}

export default App;
