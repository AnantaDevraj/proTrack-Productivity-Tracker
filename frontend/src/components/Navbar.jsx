import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('authToken');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">
        <Link to="/">ProTrack</Link>
      </h1>

      <div className="space-x-4">
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/profile" className="hover:underline">👤 Profile</Link>
            <button 
              onClick={handleLogout} 
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
