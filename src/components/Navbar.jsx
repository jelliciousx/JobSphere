import { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";
import Button from "../components/Button/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ─── DEBUG: Console mein check karo ke user object mein kya aa raha hai ───
  // console.log("USER OBJECT:", user);

  // ─── Avatar URL: Google Profile Pic > Email Gravatar > Name Initials ───
  const avatarUrl = useMemo(() => {
    if (!user) return "";

    // Google OAuth alag-alag field names mein bhejta hai — sab check karo
    const googleAvatar =
      user.avatar ||
      user.photoURL ||
      user.picture ||
      user.photo ||
      user.image ||
      user.profilePicture ||
      user.googleAvatar ||
      "";

    // Agar valid URL hai toh woh use karo
    if (
      googleAvatar &&
      typeof googleAvatar === "string" &&
      googleAvatar.startsWith("http")
    ) {
      return googleAvatar;
    }

    // Fallback 1: Email se Gravatar banao (har email ka unique avatar)
    if (user.email) {
      return `https://www.gravatar.com/avatar/${user.email.toLowerCase().trim()}?d=identicon&s=128`;
    }

    // Fallback 2: Name se initials avatar
    const name =
      user.name || user.fullName || user.displayName || user.username || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&size=128&bold=true`;
  }, [user]);

  const displayName = useMemo(() => {
    if (!user) return "";
    return (
      user.name ||
      user.fullName ||
      user.displayName ||
      user.username ||
      user.email ||
      "User"
    );
  }, [user]);

  // ─── Active link style helper ───
  const linkBase = "font-[700] transition-colors px-3 py-2 rounded-xl";
  const linkInactive =
    "text-gray-700 hover:text-[#0085ff] hover:bg-[#eff7ff]/50";
  const linkActive = "text-[#0085ff] bg-[#eff7ff]";

  const isActive = (path) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/jobs", label: "Jobs" },
    { to: "/profile", label: "Profile" },
  ];

  // ─── Image error handler ───
  const handleImageError = (e) => {
    e.target.onerror = null;
    // Agar Google image fail ho toh email Gravatar try karo
    if (user?.email) {
      e.target.src = `https://www.gravatar.com/avatar/${user.email.toLowerCase().trim()}?d=identicon&s=128`;
    } else {
      e.target.src = `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128`;
    }
  };

  return (
    <nav className="bg-[var(--color-background)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="JobSphere Logo" className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkBase} ${isActive(link.to) ? linkActive : linkInactive}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/signup">
                  <Button
                    text="Sign Up"
                    textcolor="text-secondary"
                    background="bg-transparent text-gray-900 hover:bg-gray-900 hover:text-white"
                    className="!w-auto !h-auto px-6 py-2 !gap-2 font-semibold"
                  />
                </Link>
                <Link to="/login">
                  <Button
                    text="Login"
                    background="bg-primary hover:bg-blue-700"
                    textcolor="text-white"
                    rightIcon={<span>⇢</span>}
                    className="w-[144px] !h-auto px-6 py-2 !gap-2 font-semibold rounded-4xl"
                  />
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`text-sm font-semibold px-3 py-2 rounded-xl transition-colors ${
                      isActive("/admin")
                        ? "text-[#0085ff] bg-[#eff7ff]"
                        : "text-blue-600 hover:text-blue-700 hover:bg-[#eff7ff]/50"
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 bg-gray-100"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <span className="text-sm font-medium text-gray-700 hidden lg:block">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:bg-[#eff7ff] transition-colors"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isOpen ? "rotate-90" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-xl font-semibold transition-colors ${
                  isActive(link.to)
                    ? "text-[#0085ff] bg-[#eff7ff]"
                    : "text-gray-700 hover:bg-[#eff7ff]/50 hover:text-[#0085ff]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            {!user ? (
              <div className="pt-2 space-y-2 px-2">
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button
                    text="Sign Up"
                    background="bg-transparent border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    className="w-full !h-auto px-6 py-2 rounded-lg !gap-2 font-semibold justify-center"
                  />
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    text="Login"
                    background="bg-primary hover:bg-blue-700"
                    rightIcon={<span>⇢</span>}
                    className="w-full !h-auto px-6 py-2 rounded-lg !gap-2 font-semibold justify-center"
                  />
                </Link>
              </div>
            ) : (
              <div className="pt-2 px-2 space-y-1">
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2.5 rounded-xl font-semibold transition-colors ${
                      isActive("/admin")
                        ? "text-[#0085ff] bg-[#eff7ff]"
                        : "text-blue-600 hover:bg-blue-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {displayName}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
