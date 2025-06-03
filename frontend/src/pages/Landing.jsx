import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl md:text-6xl font-bold text-blue-700 mb-4 animate-fadeIn">
        ProTrack
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl animate-fadeIn delay-100">
        Your smart productivity partner. Set daily goals, track tasks, and visualize progress.
      </p>
      <div className="space-x-4 animate-fadeIn delay-200">
        <Link to="/register">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
            Login
          </button>
        </Link>
      </div>
      <div className="mt-12 text-sm text-gray-600 animate-fadeIn delay-300">
        Built to help you stay focused, consistent, and productive. 💪
      </div>
    </div>
  );
};

export default Landing;
