import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch Profile Data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setForm(res.data);
      setError("");
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
      setError("Failed to load profile. Please try again.");
      if (err.response?.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Save Changes
  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        "http://localhost:5000/api/users/profile",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(res.data);
      setEditing(false);
      setError("");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <h2 className="text-2xl font-bold text-white">👤 User Profile</h2>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <img
                  src={form.profilePic || "https://placehold.co/150x150"}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {editing && (
                  <input
                    name="profilePic"
                    value={form.profilePic || ""}
                    onChange={handleChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Profile picture URL"
                  />
                )}
              </div>

              {!editing ? (
                <div className="w-full space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="text-lg font-semibold">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-semibold">{user.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-lg font-semibold">{user.contact || "Not provided"}</p>
                  </div>

                  <div className="flex justify-center space-x-4 pt-4">
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      name="name"
                      value={form.name || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      value={form.email || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact</label>
                    <input
                      name="contact"
                      value={form.contact || ""}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex justify-center space-x-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
