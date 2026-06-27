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

// ── Dropdown/menu icons ──
// All built to the same spec (24x24 viewBox, currentColor stroke,
// strokeWidth 2, round caps/joins) so they render at a consistent,
// predictable size — unlike raw emoji characters, which can render
// oversized on some OS/browser combinations and get visually clipped
// by the dropdown's overflow:hidden, making the text next to them
// disappear even though it's still present in the DOM.

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

const BookingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </svg>
);

const AdminIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
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
                      <span className="nav-dropdown-icon"><UserIcon /></span>
                      Profile
                    </Link>

                    <Link
                      to="/bookings"
                      className="nav-dropdown-item"
                      onClick={() => { setDropdownOpen(false); closeMenu(); }}
                    >
                      <span className="nav-dropdown-icon"><BookingsIcon /></span>
                      My Bookings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="nav-dropdown-item"
                        onClick={() => { setDropdownOpen(false); closeMenu(); }}
                      >
                        <span className="nav-dropdown-icon"><AdminIcon /></span>
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="nav-dropdown-divider" />

                    <button
                      className="nav-dropdown-item nav-dropdown-logout"
                      onClick={handleLogout}
                    >
                      <span className="nav-dropdown-icon"><LogoutIcon /></span>
                      Logout
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