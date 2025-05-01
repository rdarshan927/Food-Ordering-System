import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    if (storedRole) setRole(storedRole);
    if (storedId) setUserId(storedId);
    if (storedUsername) setUsername(storedUsername);

    // Add scroll listener for header animation
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  // Function to check if a link is active
  const isLinkActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className={`${isScrolled ? 'py-2 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900' : 'py-3 bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800'} text-white shadow-lg sticky top-0 z-50 border-b border-blue-900/40 transition-all duration-300`}>
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center group relative z-10">
          <div className="relative mr-3">
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-[3px] opacity-60 group-hover:opacity-80 transition-opacity"></div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 relative text-yellow-300 transform group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight group-hover:tracking-wide transition-all duration-300">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Ez Food Delivery
              </span>
            </h1>
            {role && username && (
              <div className="flex items-center text-xs text-blue-200 font-medium tracking-wide -mt-1">
                <span className="animate-pulse mr-1.5">•</span>
                Welcome, {username}
              </div>
            )}
          </div>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center px-3 py-2 border rounded-lg text-blue-200 border-blue-400/70 hover:text-white hover:border-white hover:bg-blue-700/50 transition-all"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
        
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:flex w-full md:w-auto md:items-center mt-4 md:mt-0 transition-all duration-200`}>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <Link
              to="/"
              className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </Link>

            {/* Common navigation for all logged-in users */}
            {role && (
              <>
                <Link
                  to="/customer-dashboard"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/customer-dashboard') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Menu
                </Link>
              </>
            )}

            {/* User-specific navigation options */}
            {role === "USER" && (
              <>
                <Link
                  to="/order"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/order') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Orders
                </Link>
                <Link
                  to="/cart"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/cart') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart
                </Link>
                <Link
                  to="/add-payment"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/add-payment') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment
                </Link>
              </>
            )}

            {/* Driver-specific navigation options */}
            {role === "DRIVER" && (
              <>
                <Link
                  to={`/driver/${userId}`}
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive(`/driver/${userId}`) ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  Delivery Map
                </Link>
                <Link
                  to="/driverdashboard"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/driverdashboard') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Dashboard
                </Link>
              </>
            )}

            {/* Admin-specific navigation options */}
            {role === "ADMIN" && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/admin/dashboard') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/admin/users') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Manage Users
                </Link>
                <Link
                  to="/admin/orders"
                  className={`py-2 px-3 rounded-lg transition-colors duration-200 font-medium flex items-center ${isLinkActive('/admin/orders') ? 'bg-blue-600/50 text-white' : 'hover:bg-blue-700/30 text-blue-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Manage Orders
                </Link>
              </>
            )}

            <div className="md:ml-4 h-8 md:border-l border-blue-500/30 hidden md:block"></div>

            {/* Authentication buttons */}
            {!role && (
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                <Link
                  to="/auth/login"
                  className="py-2 px-4 rounded-lg bg-blue-600/90 hover:bg-blue-600 transition-colors duration-200 font-medium flex items-center shadow-sm backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-green-600/90 to-emerald-600/90 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 font-medium flex items-center shadow-sm backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </Link>
              </div>
            )}

            {/* User profile and logout */}
            {role && (
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                <Link
                  to="/login"
                  className="py-2 px-3 rounded-lg border border-blue-500/30 hover:bg-blue-700/30 transition-colors duration-200 font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Restaurant Login
                </Link>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 rounded-lg bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-600 hover:to-rose-600 transition-all duration-200 font-medium flex items-center shadow-sm backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
