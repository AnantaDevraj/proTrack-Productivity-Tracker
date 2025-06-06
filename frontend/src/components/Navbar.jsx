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
            <Link to="/dashboard" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors">Dashboard</Link>
            <Link to="/profile" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors">👤 Profile</Link>
            <Link to="/weekly-stats" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors"> 
            📊 Weekly Stats 
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors">Login</Link>
            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-300 transition-colors">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
