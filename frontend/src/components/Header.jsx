import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("userId");
    if (storedRole) setRole(storedRole);
    if (storedId) setUserId(storedId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex sm:flex-row justify-between items-center gap-2">
        <h1 className="text-2xl font-semibold">🚀 Delivery App</h1>
        <nav className="flex flex-wrap justify-center sm:justify-end items-center gap-4 text-sm sm:text-base">
          <Link
            to="/"
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Home
          </Link>

          <Link
            to={`/driver/${userId}`}
            className="hover:text-gray-200 transition-colors duration-200"
          >
            Go to Delivery Page
          </Link>

          {role === "DRIVER" && (
            <Link
              to={`/driver/${userId}`}
              className="hover:text-gray-200 transition-colors duration-200"
            >
              Driver Page
            </Link>
          )}

          {role === "USER" && (
            <Link
              to="/driverdashboard"
              className="hover:text-gray-200 transition-colors duration-200"
            >
              Live Driver Tracker
            </Link>
          )}

          {!role && (
            <>
              <Link
                to="/auth/login"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="hover:text-gray-200 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}

          {role && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors duration-200"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
