import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logout } from "../../redux/slices/authSlice";
import NotificationBell from "../NotificationBell/NotificationBell";

import "./Navbar.css";

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ── scroll listener ──
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── lock body scroll when mobile menu is open ──
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [menuOpen]);

  // ── close dropdown when clicking outside ──
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── close dropdown on route change ──
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully", { toastId: "logout-success" });
    setDropdownOpen(false);
    closeMenu();
    navigate("/login");
  };

  return (
    <header
      className={`navbar ${scrolled || isAdminRoute ? "navbar-scrolled" : ""} ${
        isAdminRoute ? "navbar-admin" : ""
      }`}
    >
      <div className="navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          MERIDIAN
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>

          {/* ── Core links (always visible) ── */}
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/search" onClick={closeMenu}>Tours</NavLink>

          {user && (
            <NavLink to="/bookings" onClick={closeMenu}>Bookings</NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" onClick={closeMenu}>Dashboard</NavLink>
          )}

          {/* ── Auth section ── */}
          {!user ? (
            <>
              <NavLink to="/login" onClick={closeMenu}>Login</NavLink>
              <NavLink to="/register" className="register-btn" onClick={closeMenu}>
                Register
              </NavLink>
            </>
          ) : (
            <div className="nav-user-section">
              <NotificationBell />

              {/* User icon + dropdown */}
              <div className="nav-user-dropdown" ref={dropdownRef}>
                <button
                  className="nav-user-btn"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="nav-user-avatar">
                    <UserIcon />
                  </div>
                  <span className="nav-user-chevron">
                    {dropdownOpen ? "▲" : "▼"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="nav-dropdown-menu">
                    <div className="nav-dropdown-header">
                      <p className="nav-dropdown-name">{user.name}</p>
                      <p className="nav-dropdown-email">{user.email}</p>
                    </div>

                    <div className="nav-dropdown-divider" />

                    <Link
                      to="/profile"
                      className="nav-dropdown-item"
                      onClick={() => { setDropdownOpen(false); closeMenu(); }}
                    >
                      <span>👤</span> Profile
                    </Link>

                    <Link
                      to="/bookings"
                      className="nav-dropdown-item"
                      onClick={() => { setDropdownOpen(false); closeMenu(); }}
                    >
                      <span>🧳</span> My Bookings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="nav-dropdown-item"
                        onClick={() => { setDropdownOpen(false); closeMenu(); }}
                      >
                        <span>⚙️</span> Admin Dashboard
                      </Link>
                    )}

                    <div className="nav-dropdown-divider" />

                    <button
                      className="nav-dropdown-item nav-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;